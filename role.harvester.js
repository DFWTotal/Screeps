var roleHarvester = {
    run: function(creep) {
        if(!creep.memory.state) {
            creep.memory.state = 'HARVESTING';
        }

        switch (creep.memory.state) {
            case 'HARVESTING':
                this.harvest(creep);
                break;
            case 'TRANSFERING':
                this.transfer(creep);
                break;
            // Add logic to create a standby creep. Could be changed to a different role as well.
            default:
                console.log('Unknown state: ' + creep.memory.state);
                creep.memory.state = 'HARVESTING';
        }
    },

    harvest: function(creep) {
        if(!creep.memory.sourceId) {
            // Find energy sources
            let sources = creep.room.find(FIND_SOURCES);
            let sourceCreeps = {};

            // Initialize count for each source
            sources.forEach(source => srouceCreeps[source.id] = 0);

            // Count creeps assigned to each source
            for (let name in Game.creeps) {
                let otherCreep = Game.creeps[name];
                if(otherCreep.memory.role == 'harvester' && otherCreep.memory.sourceId){
                    sourceCreeps[otherCreep.memory.sourceId]++;
                }
            }

            // Assign the creep to the least crowded source
            let leastCrowdedSource = sources[0];
            for (let source of sources) {
                if (sourceCreeps[source.id] < sourceCreeps[leastCrowdedSource.id]) {
                    leastCrowdedSource = source;
                }
            }

            creep.memory.sourceId = leastCrowdedSource.id;
        }

        // Perform harvesting task
        if (creep.store.getFreeCapacity() == 0) {
            console.log(`${creep.name} transitioning from HARVESTING to TRANSFERING`);
            creep.memory.state = 'TRANSFERING';
            return;
        }

        let source = Game.getObjectById(creep.memory.sourceId);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    transfer: function(creep) {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            console.log(`${creep.name} transitioning from TRANSFERING to HARVESTING`);
            creep.memory.state = 'HARVESTING';
            return;
        }

        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_STORAGE) &&
                       structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;
