var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var upgraderCounter = 0;
var harvesterCounter = 0;
var builderCounter = 0;

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
    var harvesterCount = _.filter(Game.creeps, (creeps) => creeps.memory.role == 'harvester');
    var upgraderCount = _.filter(Game.creeps, (creeps) => creeps.memory.role == 'upgrader');
    var builderCount = _.filter(Game.creeps, (creeps) => creeps.memory.role == 'builder');
    let spawnHavesterOK = harvesterCount.length <= 4;
    let spawnBuilderOK = builderCount.length <= 3;
    let spawnUpgraderOK = upgraderCount.length <= 3;

    if ( spawnHavesterOK ) {
        var newName = 'h' + harvesterCounter;
        const spawnResult = Game.spawns['Spawn1'].spawnCreep(basicCreep, newName, {
            memory: {role: 'harvester'}
        });
        if (spawnResult === OK) {
            harvesterCounter++;
            console.log("Spawning new harvester: " + newName);
        }
    } else if (spawnBuilderOK) {
        var newName = 'b' + builderCounter;
        const spawnResult = Game.spawns['Spawn1'].spawnCreep(twoWorkCreep, newName, {
            memory: {role: 'builder'}
        });
        if ( spawnResult === OK ) {
            builderCounter++;
            console.log("Spawning new builder: " + newName);
        }
    } else if (spawnUpgraderOK) {
        var newName = 'u' + upgraderCounter;
        const spawnResult = Game.spawns['Spawn1'].spawnCreep(basicCreep, newName, {
            memory: {role: 'upgrader'}
        });
        if (spawnResult === OK) {
            upgraderCounter++;
            console.log("Spawning new upgrader: " + newName);
        }
    }

    for ( var name in Game.creeps ) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
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