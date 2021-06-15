
Hooks.on("targetToken", function(user, token, someBool) {
    const controlledTokens = canvas.tokens.controlled;
    const sceneId = token.scene.id;

    for(let controlledToken in controlledTokens) {
        const associatedUser = getAssociatedUser(controlledTokens[controlledToken]);
        if(associatedUser == null) {
            continue;
        }
        let targets = associatedUser.targets.ids;
        if(targets.includes(token.id)) {
            continue;
        }
        targets.push(token.id);
        const activityData = {
            "targets": targets,
            "sceneId": sceneId
        };
        game.socket.emit('userActivity', associatedUser.id, activityData);
    }
});

function getAssociatedUser(controlledToken) {
    const permArray = Object.entries(controlledToken.actor.data.permission);
    const users = permArray.map(function(permArr) {
        if(permArr[1] !== 3) {
            return null;
        }
        const user = game.users.get(permArr[0]);
        if(!user || user.isGM || user.data.name === "Omniplayer") {
            return null;
        }
        return user;
    }).filter(u=>u);
    if(users.length === 0) {
        console.error("Cannot find associated user");
        return null;
    } else if (users.length > 1) {
        console.error("Found multiple associated users")
        return null;
    }
    return users[0];
}