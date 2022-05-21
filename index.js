/*


hebraw code = iw


@ilay_harari => 1418597188440141835

@alqastalps => 1231191691178184705

@gazanownews => 1393670201883889665

@qudsn_brk => 3484217843

@aljarmaqnet => 1371961068176744450

@katebat_jeneen => 1477377250911825924

@alaqsavoice_brk => 389536829

@alaqsavoice => 158353216


*/

const twit = require('twit');
const axios = require('axios');
const translatte = require('translatte');
const fs = require('fs');
const client = require('https');
const http = require('http');

const api = 'AIzaSyCLDP2Tw90gts1K1zNIehVtqOBOaOTI3HI'
const googleTranslate = require('google-translate')(api);

const config = {  
    consumer_key: '04tA5YUNfIi73GG4wksEo1hjJ',  
    consumer_secret: 'JSFRI0DGvIzzBXllcHY3DQu3bYWXCvJdnaIx2hopMccVgiCgr8',
    access_token: '1515628251862949892-YkOeKzPJXUXv72qfuen36mSKLnmGlk',  
    access_token_secret: 'H7ytmndLaNcTwXJV2NU1dfoUy3WgtFRVin6PFsz9XdiPY'
}
  
const Twitter = new twit(config);

async function getNextMeetingInfo() {
    const result = await axios.get('https://api.meetup.com/Jax-Node-js-UG/events?page=2');
    return result.data[0];
}

const remove_url_from_str = (str) => str.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

const isEmpty = object =>  Object.keys(object).length === 0

const isTruncated = object => object.truncated

const existMedia = object => object.entities.media

const url_tweet = (tweet) => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

function tweetNow(tweetTxt, urlTweet) {  
    
    tweet = {
        status: tweetTxt,
        attachment_url: urlTweet
    }

    console.log(urlTweet)
    
    Twitter.post('statuses/update', tweet, function(err, data, response) {
        if (err) {
            console.log('Error in Replying');
            console.error(err);
        } else {
            console.log('Tweet sent successfully');
        }
    });

}

const stream = Twitter.stream('statuses/filter', { follow: ['1418597188440141835', '1231191691178184705', '1393670201883889665','3484217843', '1371961068176744450', '1477377250911825924', '389536829'] }); 

stream.on('tweet', async function (tweet) {    
    // const tweetwords = tweet.text.split(' ');
    if (tweet.text.indexOf('RT @') > -1){ //                   Checking if the tweet is actully retweet
        console.log(`It's a retweet, I dont publish that!`)
    }

    else if (tweet.text.charAt(0) == '@') { //                 Checking if the tweet is actully replay
        console.log(`It's replay, I don't publish that!`)
    }


    else {  //                                                 If it's a real tweet

        console.log(tweet)

        const urlTweet = url_tweet(tweet)

        if (isTruncated(tweet)) {

            text = remove_url_from_str(tweet.extended_tweet.full_text)

            googleTranslate.translate(text, 'he', (err, translation) => {
                tweetNow(`${translation.translatedText} \n \n ${tweet.user.name}`, urlTweet);
            });     

        } 

        else {
            text = remove_url_from_str(tweet.text)

            googleTranslate.translate(text, 'he', (err, translation) => {
                tweetNow(`${translation.translatedText} \n \n ${tweet.user.name}`, urlTweet);
            }); 

        }

        

    }

    // tweetNow(tweet.text)

    
    
});