const coinremitter = require('coinremitter-api');
const obj = new coinremitter(
  process.env.COINREMITTER_API_KEY,
  process.env.COINREMITTER_PASSWORD,
  'BTC'
);

const EXPIRE_TIME = '30'; // in minutes
const AMOUNT = '1'; // in ETH

function getBalance(callback) {
  return obj.getBalance((err, res) => callback(err, res));
}

function createInvoice(name, email, telegram, host, callback) {
  return obj.createInvoice({
    'amount': AMOUNT,
    'name': name,
    'expire_time': EXPIRE_TIME,
    // 'notify_url': `${host}/notify_url`,
    // 'success_url': `${host}/success_url`,
    // 'fail_url': `${host}/fail_url`,
    'description': 'This is a description',
    'custom_data1': email,
    'custom_data2': telegram
  }, (err, res) => {
    callback(err, res);
  });
}

/*
const example_response = {
  id: '65e4b2fac4a6dbcd6e0d6cc9',
  invoice_id: 'BTC022',
  merchant_id: '65d792c23bae925391037a1c',
  url: 'https://coinremitter.com/invoice/65e4b2fac4a6dbcd6e0d6cc9',
  total_amount: { BTC: '1.00000000', USD: '62836.00000000' },
  paid_amount: '[]',
  usd_amount: '62836.00000000',
  conversion_rate: { USD_BTC: '0.00001591', BTC_USD: '62836.00000000' },
  base_currency: '',
  coin: 'BTC',
  name: 'a',
  description: 'This is a description',
  wallet_name: 'BTC-Wallet',
  address: 'bc1qyf526sc8wvqhcu9vukm6ne7ax82eh2rvf26c7d',
  status: 'Pending',
  status_code: 0,
  success_url: '',
  fail_url: '',
  notify_url: '',
  expire_on: '2024-03-03 17:57:22',
  invoice_date: '2024-03-03T17:27:22.285000Z',
  custom_data1: 'a@gmail.com',
  custom_data2: 'a',
  last_updated_date: '2024-03-03T17:27:22.285000Z'
}
**/

module.exports = {
  createInvoice,
  getBalance
}