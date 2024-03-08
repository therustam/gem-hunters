export async function createPaymentRequest() {
    console.log("I am in api")
    // const API_URL = 'https://coinremitter.com/api/v3/BTC/invoice'; // Replace [currency] with the desired currency code
    // const API_KEY = '$2y$10$Q8P7AB/s9tNNxbRhis/BPeA85PzlJyTVTSVcCAZjjPzRq8iEucvmW';
    // const PASSWORD = 'gemhunters2024';
  
    // try {
    //   const response = await fetch(API_URL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': API_KEY,
    //     },
    //     body: JSON.stringify({
    //       // Include the parameters required by Coinremitter's API here
    //       // For example:
    //       amount: "34",
    //       currency: "BTC",
    //       // ... any other necessary parameters
    //     }),
    //   });
  
    //   const data = await response.json();
    //   if (response.ok) {
    //     // Handle successful response
    //     // data will contain the payment information, like an invoice ID or payment URL
    //     return { success: true, data };
    //   } else {
    //     // Handle non-successful responses
    //     return { success: false, error: data.message || 'Error creating payment request' };
    //   }
    // } catch (error) {
    //   // Handle fetch errors
    //   return { success: false, error: error.message || 'Network error' };
    // }
     
    // const { amount, currency } = req.body;

    // const COINREMITTER_API_KEY = process.env.COINREMITTER_API_KEY;
    // const COINREMITTER_PASSWORD = process.env.COINREMITTER_PASSWORD; // If required

    try {
      const response = await fetch('https://coinremitter.com/api/v3/BTC/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include additional headers as required by CoinRemitter
        },
        body: JSON.stringify({
          api_key: "$2y$10$Q8P7AB/s9tNNxbRhis/BPeA85PzlJyTVTSVcCAZjjPzRq8iEucvmW",
          password: "gemhunters2024", // If required
          amount: "1",
          currency: "BTC",
          // Add any other required fields
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Return the relevant data to the client
        res.status(200).json(data);
      } else {
        // Handle errors from CoinRemitter
        res.status(response.status).json({ error: data.message });
      }
    } catch (error) {
      // Handle server errors
      res.status(500).json({ error: error.message });
    }
  
  }
  