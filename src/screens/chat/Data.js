
class Data {

    static users = [
        {
            id: 0,
            imageUrl: 'https://lh3.googleusercontent.com/-ub3nhgAAj-U/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfU0LRoymj9MAMIJxxzoiNjyV0sxg/s96-c-mo/photo.jpg',
            name: 'Saikat Dutta',
            lastMessage: `It's your birthday so i will let you off this once!`,
            messages: [
                {
                    id: 1,
                    message: `Hello John, thank you for calling Provide Support. How may I help you?`,
                    from: 0,
                    to: -1
                },
                {
                    id: 2,
                    message: 'Perfect, I am really glad to hear that! How may I help you today?',
                    from: -1,
                    to: 0
                },
                {
                    id: 3,
                    message: `Hello Mary. I understand the problem and will be happy to help you. Let’s see what I can do.”`,
                    from: 0,
                    to: -1
                },
                {
                    id: 2,
                    message: `question, in a good way. Probably because support elsewhere rarely ask them this question. It instantly sets the rep on friendly terms with the customer and the conversation becomes less formal and template based while keeping a business tone`,
                    from: -1,
                    to: 0
                },
                {
                    id: 3,
                    message: `It's your birthday so i will let you off this once!”`,
                    from: 0,
                    to: -1
                },
            ]
        },
        {
            id: 1,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLKjeyA0x4bESIzB9GRujRldkqc37siZ7qM2xHL6rQmjVNqc24',
            name: 'Peter Parker',
            lastMessage: `Next wednessday would suit me better`
        },
        {
            id: 2,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYK0QY9oobawCdMMfutmm4dv9ufkt7pyNyNSvNeqqRR6DRrs-xZQ',
            name: 'Mia Khalifa',
            lastMessage: `We were both innocence`
        },
        {
            id: 3,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjOcbft8IWG9-2fuQfuMCS9Ae5ATt5ICv6jtEtZBhc2dHRmscHDw',
            name: 'James Jhon',
            lastMessage: `Hey, how are you man ?`
        },
        {
            id: 4,
            imageUrl: 'https://cdn4.iconfinder.com/data/icons/cool-avatars-2/190/00-24-512.png',
            name: 'Danny Dayel',
            lastMessage: `It's your birthday so i will let you off this once!`
        },
        {
            id: 5,
            imageUrl: 'https://cdn3.iconfinder.com/data/icons/avatars-29/100/Avatar-16-512.png',
            name: 'Asher Vinu',
            lastMessage: `Next wednessday would suit me better`
        },
        {
            id: 6,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYw2jQex54Sc51yfq_goEerZpVnZAjdkvzlM7bJKwOkhF1iEff',
            name: 'Sudharsan Nishu',
            lastMessage: `We were both innocence`
        },
        {
            id: 7,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvWuFomNzdR31rPId-TXqio_LVrAoe73HjV1SG5PSQ8AdSUgTg',
            name: 'Vivek Asai',
            lastMessage: `Hey, how are you man ?`
        },
        {
            id: 8,
            imageUrl: 'https://cdn2.iconfinder.com/data/icons/the-world-faces/512/Cool_Guy_Face_Avatar-512.png',
            name: 'Ramesh T',
            lastMessage: `It's your birthday so i will let you off this once!`
        },
        {
            id: 9,
            imageUrl: 'https://cdn3.iconfinder.com/data/icons/avatars-flat/33/man_3-512.png',
            name: 'Amit Kumar',
            lastMessage: `Next wednessday would suit me better`
        },
        {
            id: 10,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7A5lfCIwQeDtTjDEZdaxgoWIMehz40r-j22ROT4LeWkUOzo3t',
            name: 'Sonam Kapoor',
            lastMessage: `We were both innocence`
        },
        {
            id: 11,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkQbCUi5Fxvc4WV88gUXSPpIeQSGB9iSC2ER-00ebq11JM1854',
            name: 'Lisa Headen',
            lastMessage: `Hey, how are you man ?`
        },

    ];


    static getUsers() {
        return this.users;
    }

    static findUserById(userid) {
        let user = this.users.find((user) => {
            return user.id == userid;
        });

        return user;
    }

    static getCurrentUser() {
        return {
            id: -1,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLKjeyA0x4bESIzB9GRujRldkqc37siZ7qM2xHL6rQmjVNqc24',
            name: 'Peter Parker'
        };
    }

}

module.exports = Data;