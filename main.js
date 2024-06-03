var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const harvesterBody = [WORK, CARRY, MOVE];
const upgraderBody = [WORK, CARRY, MOVE];
const builderBody = [WORK, CARRY, MOVE];

function getBodyCost(body) {
    return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
}

module.exports.loop = function () {
    var spawner = Game.spawns['Spawner'];
    
    var harvesterCount = _.sum(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraderCount = _.sum(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builderCount = _.sum(Game.creeps, (creep) => creep.memory.role == 'builder');
    
    if (Game.time % 30 === 0) {
        console.log('Number of harvester creeps: ' + harvesterCount);
        console.log('Number of upgrader creeps: ' + upgraderCount);
        console.log('Number of builder creeps: ' + builderCount);
    }
    
    if (spawner.store[RESOURCE_ENERGY] >= getBodyCost(harvesterBody) && harvesterCount < 3) {
        var newName = 'Harvester' + Game.time;
        spawner.spawnCreep(harvesterBody, newName, {memory: {role: 'harvester'}});
    } else if (spawner.store[RESOURCE_ENERGY] >= getBodyCost(upgraderBody) && upgraderCount < 5) {
        var newName = 'Upgrader' + Game.time;
        spawner.spawnCreep(upgraderBody, newName, {memory: {role: 'upgrader'}});
    } else if (spawner.store[RESOURCE_ENERGY] >= getBodyCost(builderBody) && builderCount < 3) {
        var newName = 'Builder' + Game.time;
        spawner.spawnCreep(builderBody, newName, {memory: {role: 'builder'}});
    }
    
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        //console.log(`${name} has ${creep.ticksToLive} ticks to live.`);
        
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
};
