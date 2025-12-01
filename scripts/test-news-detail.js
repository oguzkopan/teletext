// Test script to debug news detail page issues
const NEWS_API_KEY = process.env.NEWS_API_KEY || '44c30f5450634eaeaa9eea6e0cbde0d0';

async function testNewsDetail() {
  console.log('Testing News Detail Page Logic\n');
  console.log('='.repeat(60));
  
  // Simulate what page 201 does
  console.log('\n1. Fetching articles for page 201 (UK News):');
  const url = `https://newsapi.org/v2/top-headlines?country=gb&pageSize=10&apiKey=${NEWS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    console.log(`   Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
      return;
    }
    
    const data = await response.json();
    console.log(`   Total articles: ${data.articles?.length || 0}`);
    console.log(`   Status: ${data.status}`);
    
    if (data.articles && data.articles.length > 0) {
      console.log('\n2. Articles available:');
      data.articles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title?.substring(0, 60)}...`);
      });
      
      console.log('\n3. Testing article detail (201-1):');
      console.log(`   Requesting article at index 0`);
      const article = data.articles[0];
      if (article) {
        console.log(`   ✓ Article found: ${article.title}`);
        console.log(`   Source: ${article.source.name}`);
        console.log(`   Published: ${article.publishedAt}`);
      } else {
        console.log(`   ✗ Article not found at index 0`);
      }
    } else {
      console.log('\n   ✗ No articles returned');
      if (data.message) {
        console.log(`   API Message: ${data.message}`);
      }
    }
    
  } catch (error) {
    console.error(`   Error: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(60));
}

testNewsDetail();
