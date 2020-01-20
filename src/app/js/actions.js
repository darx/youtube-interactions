(function (doc, win) {

    const Youtube = (function () {

        const Make = new Requests({});

        const videos = function () {

            const retrieve = (channelId, cb) => {
                let Request = {
                    url: '/api/youtube/channel/videos/' 
                        + channelId,
                    method: 'GET',
                };

                Request.success = (Response) => {
                    let Data = Response.data;
                    if ('function' === typeof cb) {
                        return cb.apply(this, [ Data ]);
                    }
                };

                Make.http(Request);
            };

            const comments = (videoId) => {
                let Request = {
                    url: '/api/youtube/video/comments/' 
                        + videoId,
                    method: 'GET',
                };

                Request.success = (Response) => {
                    let Data = Response.data;
                    if ('function' === typeof cb) {
                        return cb.apply(this, [ Data ]);
                    }
                };

                Make.http(Request);
            };

            const render = (Data, Elem = document.body) => {
                Component.get('grid-video-item', (html) => {

                    var Fragments = doc.createDocumentFragment();

                    Data.forEach((Item) => {

                        let Params = [{
                            name: 'Thumbnail',
                            value: Item.snippet.thumbnails.high.url
                        }, {
                            name: 'Title',
                            value: Item.snippet.title
                        }, {
                            name: 'VideoID',
                            value: Item.id.playlistId || Item.id.videoId
                        }];

                        let Parsed = Component.parse(html, Params),
                            Frag   = Component.transform(Parsed);

                        Fragments.appendChild(Frag);

                    });

                    Elem.appendChild(Fragments);
                });
            };

            return { retrieve, render, comments };

        }();

        const channel = function () {


            const comments = () => {

            };

            return { comments };

        }();

        return { videos, channel };

    }());

    (function () {

        var Form = el('#youtube-channel-videos'),
            Data = Form.parse();

        Form.on('submit', function (Evt) {
            Evt.preventDefault();
            Youtube.videos.retrieve(Data.channelId, 
                Youtube.videos.render);
        });

    })();

    document.live('click', '.grid-video-item a', function (Evt) {
        Evt.preventDefault();

        let Link    = this.href,
            videoId = Link.parse().v;

        Youtube.videos.comments(videoId);
    });

})(document, window);