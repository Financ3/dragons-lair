module.exports = {
    dragonTreasure: async function(req, res) {
        const db = req.app.get('db');
        const treasure = await db.get_dragon_treasure(1);
        return res.status(200).send(treasure);
    },
    getUserTreasure: async function(req, res) {
        const db = req.app.get('db');
        const treasure = await db.get_user_treasure(req.session.user.id);
        return res.status(200).send(treasure);
    },
    addUserTreasure: async function(req, res) {
        const {treasureURL} = req.body;
        const {id} = req.session.user;

        const db = req.app.get('db');
        const userTreasure = await db.add_user_treasure(treasureURL, id);
        console.log(userTreasure);

        return res.status(200).send(userTreasure);
    },
    getAllTreasure: async function(req, res) {
        const db = req.app.get('db');
        const allTreasureArr = await db.get_all_treasure();
        return res.status(200).send(allTreasureArr);
    }
}