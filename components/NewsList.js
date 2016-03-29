import React, {
  Component,
  View,
  Text,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import newsService from '../services/news-service';

export default class NewsList extends Component {

  constructor() {
    super();
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      selectedArticle: undefined
    };
  }

  async componentWillMount() {
    let articles = await newsService.getNews();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(articles.data, articles.sections)
    });
  }

  selectArticle(article) {
    if (this.state.selectedArticle === article) {
      this.setState({selectedArticle: undefined});
      return;
    }
    this.setState({selectedArticle: article});
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  _renderRow(row, rowId, sectionId) {
    let {
      images: {
        thumbNail: thumbNail
      }
    } = row;
    return (
      <View>
        <TouchableOpacity
          style={styles.listRowContainer}
          onPress={this.selectArticle.bind(this, row)}>
          <Image
            source={{
            uri: thumbNail.url,
            width: thumbNail.width / 2,
            height: thumbNail.height / 2
          }}></Image>
          <Text style={styles.title}>{row.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderSectionHeader(row, sectionID) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionID}</Text>
      </View>
    );
  }

  renderArticleBody() {
    if (!this.state.selectedArticle)
      return null;
      let {
        images: {
          largeImage: largeImage
        }
      } = this.state.selectedArticle;
    return (
      <View style={styles.articleContainer}>
        <Text style={styles.headLine}>{this.state.selectedArticle.title}</Text>
          <Image
            style={styles.headlineImage}
            source={{
            uri: largeImage.url
          }}></Image>
      </View>
    );
  }

  renderArticle() {

    return (
      <View
        style={{
        height: this.state.selectedArticle === undefined
          ? 0
          : 350
      }}>
        {this.renderArticleBody()}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderArticle()}
        <ListView
          renderSectionHeader={this._renderSectionHeader.bind(this)}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}></ListView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  listRowContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row'
  },
  title: {
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 10
  },
  sectionHeader: {
    padding: 5,
    paddingHorizontal: 20,
    backgroundColor: 'lightgrey'
  },
  sectionHeaderText: {
    fontSize: 10
  },
  articleContainer : {
  },
  headLine : {
    fontSize : 22,
    fontWeight : 'bold',
    padding : 20
  },
  headlineImage : {
    flex : 1,
    height : 250,
    resizeMode : 'contain'
  }
});
