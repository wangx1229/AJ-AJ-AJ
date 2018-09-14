setInterval(() => {
  $.get('https://api.nike.com/product_feed/threads/v2/?anchor=0&count=5&filter=marketplace%28CN%29&filter=language%28zh-Hans%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom').then(data => {
    const nikeshoes = localStorage.getItem('nikeshoes') ? JSON.parse(localStorage.getItem('nikeshoes')) : {}
    data.objects.forEach(item => {
      if (!nikeshoes[item.id]) {
        nikeshoes[item.id] = true
        window.open(item.publishedContent.properties.coverCard.properties.portraitURL)
      }
    })
    localStorage.setItem('nikeshoes', JSON.stringify(nikeshoes))
  })
}, 1800)
