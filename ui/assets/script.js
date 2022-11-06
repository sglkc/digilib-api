// AXIOS

const Axios = axios.create({
  baseURL: location.href.replace('ui/', '')
});

Axios.interceptors.response.use(
  function (res) {
    res.data.status = res.status;
    return res;
  },
  function (err) {
    err.message = err.response?.data?.message;
    err.data = err.response?.data;
    err.status = err.response?.status;

    console.log(err.response);

    if (err.status >= 500)
      alert(`Terjadi error [${err.status}]: ${err.message}`);

    return Promise.reject(err);
  }
);

// USER

Axios('/user')
  .then((res) => {
    $('#user-form input').each((_, elm) => {
      const name = $(elm).prop('name');
      $(elm).val(res.data.result[name]);
    });
  })
  .catch(() => false);

$('#user-form').on('submit', (e) => {
  e.preventDefault();

  Axios.patch('/user', {
    nama: $('#user-form [name=nama]').val(),
    email: $('#user-form [name=email]').val(),
    tanggal_lahir: $('#user-form [name=tanggal_lahir]').val(),
  })
    .then(() => alert('Akun admin diperbarui'))
    .catch(() => false);

  const password = $('#user-form [name=password]').val();
  if (!password.length) return;
  if (password.length < 6) return alert('Password harus lebih dari 6 karakter');

  Axios.patch('/user/password', { password })
    .then(() => alert('Password akun admin diperbarui'))
    .catch(() => false);
});

// ITEM

const ITEM = {
  row: $('#item-row').clone().removeAttr('id').removeAttr('hidden'),
  page: 1,
  pages: 1,
  limit: 5,
  search: null,
  type: null,
  filesUploaded: false
}

function uploadItemFiles() {
  const data = new FormData();
  const files = {
    cover: $('#item-file-form [name=file-cover]').get(0).files.item(0),
    media: $('#item-file-form [name=file-media]').get(0).files.item(0)
  };

  if (files.cover)
    data.append('cover', files.cover, Date.now() + '-' + files.cover.name);
  if (files.media)
    data.append('media', files.media, Date.now() + '-' + files.media.name);
  if (!data.entries().next().value) return;

  Axios.post('/files', data)
    .then(() => {
      alert('File sukses diupload');
      $('#item-form [name=cover]').val(data.get('cover').name);
      $('#item-form [name=media]').val(data.get('media').name);
      ITEM.filesUploaded = true;
    })
    .catch(() => false);
}

function submitItemForm(e) {
  e.preventDefault();

  const data = {
    title: $('#item-form [name=title]').val(),
    author: $('#item-form [name=author]').val(),
    description: $('#item-form [name=description]').val(),
    cover: $('#item-form [name=cover]').val(),
    media: $('#item-form [name=media]').val(),
    type: $('#item-form [name=type]:checked').val(),
    categories: $('#item-form [name=categories]').val().split(','),
    tag: {
      tokoh: $('#item-form [tag] [name=tokoh]').val(),
      tempat: $('#item-form [tag] [name=tempat]').val(),
      peristiwa: $('#item-form [tag] [name=peristiwa]').val(),
      waktu: $('#item-form [tag] [name=waktu]').val(),
    }
  };

  if (!data.cover || !data.media)
    return alert('Silahkan isi file cover dan media untuk item');
  if (!ITEM.filesUploaded)
    return alert('Silahkan klik tombol upload sebelum submit');

  if ($('#item-form [type=submit]').text() === 'Add') {
    Axios.post('/items', data)
      .then(() => {
        alert('Sukses menambahkan item');
        fetchItems();
        toggleItemForm();
        ITEMS.filesUploaded = false;
      })
      .catch(() => false);
  } else {
    Axios.patch('/items/' + id)
      .then(() => {
        alert('Sukses mengedit item');
        fetchItems();
        toggleItemForm();
        ITEMS.filesUploaded = false;
      })
      .catch(() => false);
  }
}

function toggleItemForm() {
  $('#item-title').text('Add Item');
  $('#item-form > [type=submit]').text('Add');
  $('#item-form > [type=button]').attr('hidden', true);
  $('#item-form [type=radio]').removeAttr('checked');
  $('#item-form [type=radio]').eq(0).attr('checked', true);
  $('#item-form').get(0).reset();
}

function searchItem(e) {
  e.preventDefault();

  const search = $('#item-search [name=search]').val();
  const type = $('#item-search [name=type]').val();
  const params = new URLSearchParams({ limit: ITEM.limit, page: ITEM.page });

  if (search) params.append('search', search);
  if (type && type !== 'all') params.append('type', type);

  fetchItems(params);
}

async function fetchItems(
  params = new URLSearchParams({ limit: ITEM.limit, page: ITEM.page })
) {
  let res, count, result;

  $('#item-table').children().remove();

  try {
    res = await Axios('/items?' + params.toString());
    count = res.data.count;
    result = res.data.result;
  } catch (err) {
    return $('#item-table').append('<b>Item kosong</b>');
  }

  result.forEach((item) => {
    const row = ITEM.row.clone();

    $('[title]', row).text(item.title);
    $('[author]', row).text(item.author);
    $('[description]', row).text(item.description.slice(0, 50) + '...');
    $('[cover]', row).prop('src', '../files/cover/' + item.cover);
    $('[media]', row).text(item.media);
    $('[type]', row).text(item.type);
    $('button', row).click(() => editItem(item.item_id));
    $('#item-table').append(row);
  });

  $('#item-pagination li:not([keep])').remove();

  ITEM.pages = Math.round(count / ITEM.limit);

  for (let i = 1; i < ITEM.pages; i++) {
    $('#item-pagination > :last-child')
      .before(`<li ${i === ITEM.page ? 'class="uk-active"' : ''}><a>${i}</a></li>`);
    $('#item-pagination > li:nth-last-child(2)').click(() => {
      ITEM.page = i;
      fetchItems();
    });
  }
}

async function editItem(id) {
  let res, result;

  $('#item-title').text('Edit Item (ID ' + id + ')');
  $('#item-form > [type=submit]').text('Edit');
  $('#item-form > [type=button]').attr('hidden', false);
  $('#item-form [delete]').click(() => deleteItem(id));

  try {
    res = await Axios('/items/' + id);
    result = res.data.result;
  } catch (err) {
    return false;
  }

  $('#item-form [name]:not([tag]):not([type=radio])').each((_, elm) => {
    const name = $(elm).prop('name');
    $(elm).val(result[name]);
  });

  $('#item-form [type=radio]').removeAttr('checked');
  $('#item-form [type=radio]').each((_, elm) => {
    const value = $(elm).val();
    if (value === result.type) $(elm).prop('checked', true);
  });

  $('#item-form > [name=categories]').val(result.Categories.map(c => c.name));

  $('#item-form > [tag] > [name]').each((_, elm) => {
    const name = $(elm).prop('name');
    if (name === 'waktu') return;
    $(elm).val(result.Tag[name]);
  });

  $('#item-form > [tag] > [name=waktu]').val(result.Tag.waktu.slice(0, 10));
  ITEMS.filesUploaded = true;
}

async function deleteItem(id) {
  Axios.delete('/items/' + id)
    .then(() => {
      alert('Item dihapus');
      fetchItems();
      toggleItemForm();
    })
    .catch(() => false);
}

$('#item-pagination [prev]').click(() => {
  if (ITEM.page - 1 < 1) return;
  ITEM.page--;
  fetchItems();
});

$('#item-pagination [next]').click(() => {
  if (ITEM.page + 1 >= ITEM.pages) return;
  ITEM.page++;
  fetchItems();
});

$('#item-search').on('submit', searchItem);
$('#item-form [back]').click(toggleItemForm);
$('#item-form').on('submit', submitItemForm);
$('#item-file-form > button').click(uploadItemFiles);
fetchItems();
