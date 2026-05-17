import axios from 'axios';

async function testBackend() {
  const baseUrl = 'http://localhost:4000';
  
  try {
    console.log('--- Testing /api/db-status ---');
    const dbStatus = await axios.get(baseUrl + '/api/db-status');
    console.log('DB Status:', dbStatus.data);

    console.log('\n--- Testing /api/parts ---');
    const parts = await axios.get(baseUrl + '/api/parts');
    console.log('Parts Count:', parts.data.length);

    console.log('\n--- Testing /api/store-availability ---');
    const storeAvail = await axios.get(baseUrl + '/api/store-availability');
    console.log('Store Availability Rows:', storeAvail.data.length);

    console.log('\n--- Testing /smart/builder/recommend ---');
    const recommendation = await axios.post(baseUrl + '/smart/builder/recommend', {
      budget: 85000,
      use_case: 'gaming',
      preferred_brand: '',
      storage_preference: 'NVMe'
    });
    
    console.log('Recommendations Count:', recommendation.data.length);
    if (recommendation.data.length > 0) {
      const first = recommendation.data[0];
      const keys = Object.keys(first);
      const expected = ['cpu', 'gpu', 'ram', 'storage', 'psu', 'totalPrice', 'performance_score', 'compatibility_status', 'available_store'];
      const missing = expected.filter(k => !keys.includes(k));
      console.log('First rec keys:', keys);
      console.log('Missing expected keys:', missing);
      
      console.log('\n--- Testing POST /api/builds ---');
      const savePayload = {
         name: 'Test Build',
         budget_config: { budget: 85000, use_case: 'gaming' },
         parts: first
      };
      const postBuild = await axios.post(baseUrl + '/api/builds', savePayload);
      console.log('Saved Build Response:', postBuild.data);
      
      console.log('\n--- Verifying /api/builds ---');
      const builds = await axios.get(baseUrl + '/api/builds');
      const found = builds.data.find(b => b.id === postBuild.data.id);
      console.log('Build found in list:', !!found);
    }

  } catch (error) {
    console.error('Error during testing:', error.response ? error.response.data : error.message);
  }
}

testBackend();
