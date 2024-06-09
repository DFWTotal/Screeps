var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

let basicCreep = [WORK, CARRY, MOVE];
let twoWorkCreep = [WORK, WORK, CARRY, MOVE];


function hasFreeSpaceAround(spawn) {
    const terrain = Game.map.getRoomTerrain(spawn.room.name);
    const directions = [
        { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
        { x: -1, y: 0 }, { x: 1, y: 0 },
        { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ];

    for (const dir of directions) {
        const x = spawn.pos.x + dir.x;
        const y = spawn.pos.y + dir.y;
        if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
            const objects = spawn.room.lookAt(x, y);
            if (!objects.some(obj => obj.type === 'structure' || obj.type === 'constructionSite')) {
                return true;
            }
        }
    }
    return false;
}

module.exports.loop = function () {
    var harvesterCount = _.filter(Game.creeps, (c) => c.memory.role == 'harvester');
    var upgraderCount = _.filter(Game.creeps, (c) => c.memory.role == 'upgrader');
    var builderCount = _.filter(Game.creeps, (c) => c.memory.role == 'builder');
    var repairerCount = _.filter(Game.creeps, (c) => c.memory.role == 'repairer');
    let spawnHarvesterOK = harvesterCount.length <= 4;
    let spawnBuilderOK = builderCount.length <= 3;
    let spawnUpgraderOK = upgraderCount.length <= 3;
    let spawnRepairerOK = repairerCount.length <= 3;

    if (spawnHarvesterOK) {
        var newName = 'h' + Game.time;
        const spawnResult = Game.spawns['Spawn1'].spawnCreep(basicCreep, newName, {
            memory: { role: 'harvester' }
        });

        if (spawnResult === OK) {
            console.log("Spawning new harvester: " + newName);
        } else {
            // Log the error code to understand why spawning failed
            console.log("Failed to spawn new harvester: " + newName + " with error: " + spawnResult);

            // Additional debugging information
            if (spawnResult === ERR_NOT_ENOUGH_ENERGY) {
                console.log("Not enough energy to spawn new harvester.");
            } else if (spawnResult === ERR_BUSY) {
                console.log("Spawn is currently busy.");
            } else if (spawnResult === ERR_NAME_EXISTS) {
                console.log("Creep name already exists: " + newName);
            } else if (spawnResult === ERR_INVALID_ARGS) {
                console.log("Invalid arguments provided for spawning.");
            }
        }
    } else if (spawnBuilderOK) {
        var newName = 'b' + Game.time;
        const spawnResult = Game.spawns['Spawn1'].spawnCreep(twoWorkCreep, newName, {
            memory: {role: 'builder'}
        });
        if ( spawnResult === OK ) {
            console.log("Spawning new builder: " + newName);
        }
    } else if (spawnUpgraderOK) {
        var newName = 'u' + Game.time;
        const spawnResult = Game.spawns['Spawn1'].spawnCreep(basicCreep, newName, {
            memory: {role: 'upgrader'}
        });
        if (spawnResult === OK) {
            console.log("Spawning new upgrader: " + newName);
        }
    } else if (spawnRepairerOK) {
        var newName = 'r' + Game.time;
        const spawnResult = Game.spawns['Spawn1'].spawnCreep(basicCreep, newName, {
            memory: {role: 'repairer'}
        });
        if (spawnResult === OK) {
            console.log("Spawning new repairer: " + newName);
        }
    }

    for ( var name in Game.creeps ) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory: ', name);
        }
    }

    if (!hasFreeSpaceAround(Game.spawns['Spawn1'])) {
        //console.log('No free space around Spawn1 for new units to spawn.');
    } else {
        //console.log('There is free space around Spawn1.');
    }
}

/*
Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'u1', {
            memory: {role: 'repairer'}
        });
*/