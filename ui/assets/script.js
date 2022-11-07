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

    console.error(err.response);

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

function changeFileMedia() {
  const type = $('#item-file-form [name=file-media]').get(0).files.item(0).type;

  $('#item-form [type=radio]').removeAttr('checked');

  if (type === 'application/pdf')
    $('#item-form [type=radio][value=book]').attr('checked', true);
  else if (type.startsWith('audio'))
    $('#item-form [type=radio][value=audio]').attr('checked', true);
  else if (type.startsWith('video'))
    $('#item-form [type=radio][value=video]').attr('checked', true);
}

function uploadItemFiles() {
  const data = new FormData();
  const date = new Date().toISOString().slice(0, 19).match(/\d/g).join(''); // yyyymmddhhmmss
  const files = {
    cover: $('#item-file-form [name=file-cover]').get(0).files.item(0),
    media: $('#item-file-form [name=file-media]').get(0).files.item(0)
  };

  if (files.cover)
    data.append('cover', files.cover, date + '-' + files.cover.name);
  if (files.media)
    data.append('media', files.media, date + '-' + files.media.name);
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

  const categories = $('#item-form [name=categories]').val().split(',')
  const data = {
    item_id: $('#item-form [name=item_id]').val(),
    title: $('#item-form [name=title]').val(),
    author: $('#item-form [name=author]').val(),
    description: $('#item-form [name=description]').val(),
    cover: $('#item-form [name=cover]').val(),
    media: $('#item-form [name=media]').val(),
    type: $('#item-form [name=type]:checked').val(),
    categories: [ ...new Set(categories) ],
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
        ITEM.filesUploaded = false;
      })
      .catch(() => false);
  } else {
    Axios.patch('/items/' + data.item_id, data)
      .then(() => {
        alert('Sukses mengedit item');
        fetchItems();
        toggleItemForm();
        ITEM.filesUploaded = false;
      })
      .catch(() => false);
  }
}

function toggleItemForm() {
  $('#item-title').text('Add Item');
  $('#item-form > [type=submit]').text('Add');
  $('#item-form > [type=button]').attr('hidden', true);
  $('#item-form [type=radio]').removeAttr('checked');
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
  let count, result;

  $('#item-table').children().remove();

  try {
    const res = await Axios('/items?' + params.toString());
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
    $('#item-pagination > :last-child').before(
      `<li ${i === ITEM.page ? 'class="uk-active"' : ''}><a>${i}</a></li>`
    );
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
  $('#item-form [delete]').off('click');
  $('#item-form [delete]').click(() => deleteItem(id));

  try {
    res = await Axios('/items/' + id);
    result = res.data.result;
  } catch (err) {
    false;
  }

  $('#item-form [name]:not([tag]):not([type=radio])').each((_, elm) => {
    const name = $(elm).prop('name');
    $(elm).val(result[name]);
  });

  $('#item-form [type=radio]').removeAttr('checked');
  $(`#item-form [type=radio][value=${result.type}]`).attr('checked', true);

  $('#item-form > [name=categories]').val(result.Categories.map(c => c.name));

  $('#item-form > [tag] > [name]').each((_, elm) => {
    const name = $(elm).prop('name');
    if (name === 'waktu') return;
    $(elm).val(result.Tag[name]);
  });

  $('#item-form > [tag] > [name=waktu]').val(result.Tag.waktu.slice(0, 10));
  ITEM.filesUploaded = true;
}

async function deleteItem(id) {
  Axios.delete('/items/' + id)
    .then(() => false)
    .catch(() => false)
    .finally(() => {
      alert('Item dihapus');
      fetchItems();
      toggleItemForm();
    });
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
$('#item-form').on('submit', submitItemForm);
$('#item-form [name=file-media]').change(changeFileMedia);
$('#item-form [back]').click(toggleItemForm);
$('#item-file-form > button').click(uploadItemFiles);
fetchItems();

// QUOTES

const QUOTE = {
  row: $('#quote-row').clone().removeAttr('id').removeAttr('hidden'),
  page: 1,
  pages: 1,
  limit: 5,
  quotes: []
}

async function fetchQuotes() {
  let result, count;
  QUOTE.page = 1;

  $('#quote-table').children().remove();

  try {
    const res = await Axios('/quotes');
    if (!res.data.result.length) throw Error();
    QUOTE.quotes = res.data.result;
  } catch (err) {
    return $('#quote-table').append('<b>Quote kosong</b>');
  }

  for (let i = 1; i < QUOTE.limit + 1; i++) {
    const quote = QUOTE.quotes[i - 1];

    if (!quote) continue;

    const row = QUOTE.row.clone();

    $('[text]', row).text(quote.text);
    $('[author]', row).text(quote.author);
    $('button', row).click(() => editQuote(quote.quote_id));
    $('#quote-table').append(row);
  }

  $('#quote-pagination li:not([keep])').remove();

  QUOTE.pages = Math.ceil(QUOTE.quotes.length / QUOTE.limit) + 1;

  for (let i = 1; i < QUOTE.pages; i++) {
    $('#quote-pagination > :last-child').before(
      `<li ${i === QUOTE.page ? 'class="uk-active"' : ''}><a>${i}</a></li>`
    );
    $('#quote-pagination > li:nth-last-child(2)').click(() => {
      QUOTE.page = i;
      scrollQuotes();
    });
  }
}

async function scrollQuotes() {
  let i = QUOTE.limit * QUOTE.page - QUOTE.limit;

  $('#quote-table').children().remove();

  for (i; i < (QUOTE.limit * QUOTE.page); i++) {
    const quote = QUOTE.quotes[i];

    if (!quote) continue;

    const row = QUOTE.row.clone();

    $('[text]', row).text(quote.text);
    $('[author]', row).text(quote.author);
    $('button', row).click(() => editQuote(quote.quote_id));
    $('#quote-table').append(row);
  }

  $('#quote-pagination').children().removeClass('uk-active');
  $(`#quote-pagination li:contains("${QUOTE.page}")`).addClass('uk-active');
}

async function editQuote(id) {
  let res, result;

  $('#quote-title').text('Edit Quote (ID ' + id + ')');
  $('#quote-form [type=submit]').text('Edit');
  $('#quote-form [type=button]').attr('hidden', false);
  $('#quote-form [delete]').off('click');
  $('#quote-form [delete]').click(() => deleteQuote(id));

  try {
    res = await Axios('/quotes/' + id);
    result = res.data.result;
  } catch (err) {
    false;
  }

  $('#quote-form [name=quote_id]').val(result.quote_id);
  $('#quote-form [name=text]').val(result.text);
  $('#quote-form [name=author]').val(result.author);
}

async function deleteQuote(id) {
  Axios.delete('/quotes/' + id)
    .then(() => false)
    .catch(() => false)
    .finally(() => {
      alert('Quote dihapus');
      toggleQuoteForm();
      fetchQuotes();
    });
}

function submitQuoteForm(e) {
  e.preventDefault();

  const data = {
    quote_id: $('#quote-form [name=quote_id]').val(),
    text: $('#quote-form [name=text]').val(),
    author: $('#quote-form [name=author]').val()
  };

  if ($('#quote-form [type=submit]').text() === 'Add') {
    Axios.post('/quotes', data)
      .then(() => {
        alert('Sukses menambahkan quote');
        fetchQuotes();
        toggleQuoteForm();
      })
      .catch(() => false);
  } else {
    Axios.patch('/quotes/' + data.quote_id, data)
      .then(() => {
        alert('Sukses mengedit quote');
        fetchQuotes();
        toggleQuoteForm();
      })
      .catch(() => false);
  }
}

function toggleQuoteForm() {
  $('#quote-title').text('Add Quote');
  $('#quote-form [type=submit]').text('Add');
  $('#quote-form [type=button]').attr('hidden', true);
  $('#quote-form textarea').val('');
  $('#quote-form input').val('');
}

$('#quote-pagination [prev]').click(() => {
  if (QUOTE.page - 1 < 1) return;
  QUOTE.page--;
  scrollQuotes();
});

$('#quote-pagination [next]').click(() => {
  if (QUOTE.page + 1 >= QUOTE.pages) return;
  QUOTE.page++;
  scrollQuotes();
});

$('#quote-form').on('submit', submitQuoteForm);
$('#quote-form [back]').click(toggleQuoteForm);
fetchQuotes();
