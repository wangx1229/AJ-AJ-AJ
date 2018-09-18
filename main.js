const filter = [
      'marketplace(CN)',
      'language(zh-Hans)',
      'channelId(010794e5-35fe-4e32-aaff-cd2c74f89d61)',
      'exclusiveAccess(true,false)'
    ]
    const fields = [
      'active',
      'id',
      'lastFetchTime',
      'productInfo',
      'publishedContent.nodes',
      'publishedContent.properties.coverCard',
      'publishedContent.properties.productCard',
      'publishedContent.properties.products',
      'publishedContent.properties.publish.collections',
      'publishedContent.properties.relatedThreads',
      'publishedContent.properties.seo',
      'publishedContent.properties.threadType',
      'publishedContent.properties.custom'
    ]
    setInterval(() => {
      $.get('https://api.nike.com/product_feed/threads/v2', $.param({
        anchor: 0,
        count: 5,
        filter,
        fields
      }, true)).then(data => {
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
