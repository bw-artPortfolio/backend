exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('entries').del()
        .then(function() {
            // Inserts seed entries
            return knex('entries').insert([
                {
                    artist: 1,
                url: 'https://cdna.artstation.com/p/assets/images/images/013/855/676/large/guodong-zhao-7.jpg',
                    title: 'Hippo',
                    description: 'dangerous activity window mix periodic word noise squirrel voyage'
                },
                {
                    artist: 2,
                    url: 'https://cdnb.artstation.com/p/assets/images/images/014/586/669/large/mansik-yang-.jpg?1544594886',
                    title: 'Fish?',
                    description: 'board sheep eager yummy absent lazy park smash'
                },
                {
                    artist: 3,
                    url: 'https://cdna.artstation.com/p/assets/images/images/017/409/906/large/leesha-hannigan-knight-owl-artwork.jpg',
                    title: 'Owl',
                    description: 'handsome furtive stale tangible cap statuesque rigid'
                },
                {
                    artist: 4,
                    url: 'https://cdna.artstation.com/p/assets/images/images/017/225/922/large/ben-ellebracht-oxolotlsage-copy.jpg',
                    title: 'Mix',
                    description: 'nest reward fertile underwear lean extra-small'
                },
                {
                    artist: 5,
                    url: 'https://cdn3.artstation.com/p/assets/images/images/002/278/635/large/andrey-modestov-cat-knight-1.jpg?1459686223',
                    title: 'Kitty',
                    description: 'scary horrible care mysterious level'
                },
                {
                    artist: 1,
                    url: 'https://cdnb.artstation.com/p/assets/images/images/007/147/837/large/wee-yee-chong-commission-for-partran-3rd-copy-by-silverfox5213-dbl2dm7.jpg',
                    title: 'Tiger',
                    description: 'spotty mice reason superb cause intelligent hospitable fearful snatch hang self'
                },
                {
                    artist: 2,
                    url: 'https://cdna.artstation.com/p/assets/images/images/018/322/444/large/piper-thibodeau-dp2379-s.jpg',
                    title: 'Candy',
                    description: 'disillusioned face picayune bright ashamed moor branch twist high coal material old-fashioned dangerous activity window mix periodic word noise squirrel'
                },
            ]);
        });
};
