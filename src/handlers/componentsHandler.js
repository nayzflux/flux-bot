const fs = require(`fs`);

module.exports = (client) => {
    client.handleComponents = async () => {
        // const componentFolders = fs.readdirSync(`./src/components`);
        // const { buttons, selectMenus } = client;

        // for (const folder of componentFolders) {
        //     const componentFiles = fs.readdirSync(`./src/components/${folder}`).filter(file => file.endsWith(`.js`));

        //     switch (folder) {
        //         case `buttons`:
        //             for (const file of componentFiles) {
        //                 const button = require(`../components/${folder}/${file}`);
        //                 buttons.set(button.data.data.custom_id, button);
        //                 console.log(`👌 Bouton ${button.data.data.custom_id} chargé avec succès`);
        //             }
        //             break;
        //         case `selectMenus`:
        //             for (const file of componentFiles) {
        //                 const selectMenu = require(`../components/${folder}/${file}`);

        //                 selectMenus.set(selectMenu.data.data.custom_id, selectMenu);
        //                 console.log(`👌 Menu de selection ${selectMenu.data.data.custom_id} chargé avec succès`);
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        // }
    }
}