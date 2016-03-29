class NewsService {

  async getNews() {
    const request = await fetch(
      'http://api.nytimes.com/svc/topstories/v1/business.json?api-key=24205a2196d7e932e817ee9e3f0f0e1e:17:74828356'
    );
    const data = await request.json();
    const dataWithImages = data.results.filter(x => x.multimedia.length).map(
        (article, index) => {
          let thumbNail = article.multimedia.find(x => x.format ===
            'mediumThreeByTwo210');
          let largeImage = article.multimedia.find(x => x.format ===
            'superJumbo');
          if (thumbNail && largeImage) {
            return {...article,
              section: index,
              images: {
                thumbNail: thumbNail,
                largeImage: largeImage
              }
            };
          }
        }).filter(x => !!x)
      .reduce((obj, row) => {
        if (!obj[row.subsection]) {
          obj[(row.subsection || 'Other')] = [];
        }
        obj[(row.subsection || 'Other')].push(row);
        return obj;
      }, {});

    return {
      sections: Object.keys(dataWithImages),
      data: dataWithImages
    };
  }
}

export default new NewsService();
