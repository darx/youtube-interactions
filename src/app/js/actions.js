(function (doc, win) {

    const Make = new Requests({});

    (function () {

        var Form = el('#youtube-channel-videos'),
            Data = Form.parse();

        Form.on('submit', function (Evt) {
            Evt.preventDefault();

            let Request = {
                url: Form.action + Data.channelId,
                method: 'GET',
            };

            Request.success = (Response) => {
                var Data = Response.data;

                Component.get('grid-video-item', (html) => {

                    var Fragments = doc.createDocumentFragment();

                    Data.forEach((Item) => {

                        var Params = [{
                            name: 'Thumbnail',
                            value: Item.snippet.thumbnails.high.url
                        }, {
                            name: 'Title',
                            value: Item.snippet.title
                        }, {
                            name: 'VideoID',
                            value: Item.id.playlistId || Item.id.videoId
                        }];

                        var Frag = Component.transform(Component.parse(html, Params));

                        Fragments.appendChild(Frag);
                    });

                    doc.body.appendChild(Fragments);
                });

            };

            Make.http(Request);

        });

    })();

})(document, window);