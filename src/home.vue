<template>
    <div class="row">
        <div class="col-lg-4">
            <table class="table table-light table-bordered">
                <tr v-for="robot in robots">
                    <th>{{ robot.name }} - {{ robot.model }}</th>
                    <td>
                        <button 
                            class="btn btn-success" 
                            v-on:click="selectRobot(robot)"
                            v-if="!robot.connected"
                        >
                            Connect
                        </button>
                        <button 
                            class="btn btn-danger" 
                            v-on:click="robot.disconnect()"
                            v-if="robot.connected"
                        >
                            Disconnect
                        </button>
                    </td>
                </tr>
            </table>
        </div>
        <div class="col-lg-8" v-if="hasSelectedRobot">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            {{ robot.name }} - {{ robot.model }}
                        </div>
                        <div class="card-body">
                            <div v-if="connected">
                                <table class="table table-bordered">
                                    <tr>
                                        <th>Alert</th>
                                        <td>
                                            <span v-if="state.alert !== ''" class="text-danger">{{ state.alert }}</span>
                                            <span v-else class="text-success">None</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Battery</th>
                                        <td>{{ state.details.charge }}%</td>
                                    </tr>
                                    <tr>
                                        <th>Charging</th>
                                        <td>{{ state.details.isCharging }}</td>
                                    </tr>
                                    <tr>
                                        <th>Docked</th>
                                        <td>{{ state.details.isDocked }}</td>
                                    </tr>
                                </table>
                                <button class="btn btn-success" v-if="state.availableCommands.start" v-on:click="robot.startHouseCleaning()">Start</button>
                                <button class="btn btn-success" v-if="state.availableCommands.resume" v-on:click="robot.resumeCleaning()">Resume</button>
                                <button class="btn btn-primary" v-if="state.availableCommands.pause" v-on:click="robot.pauseCleaning()">Pause</button>
                                <button class="btn btn-danger" v-if="state.availableCommands.resume" v-on:click="robot.stopCleaning()">Stop</button>
                                <button class="btn btn-success" v-if="state.availableCommands.goToBase" v-on:click="robot.sendToBase()">Return to Base</button>
                                <hr>
                                <button class="btn btn-success" v-on:click="robot.findMe()">Find Robot</button>
                            </div>
                            <div v-else>Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row map">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">Latest Cleaning Map</div>
                        <div class="card-body">
                            <img v-bind:src="mapURL" v-if="mapURL !== ''">
                            <p v-else>{{ mapLoadingMessage }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            robots: [],
            hasSelectedRobot: false,
            connected: false,
            robot: {},
            state: {
                details: {},
                availableCommands: {},
                alert: ''
            },
            mapURL: '',
            loadMapsTimer: 0,
            mapLoadingMessage: 'Loading...'
        }
    },
    methods: {
        loadRobots: function() {
            self = this;
            new Neato.User().getRobots().done(function (robots) {
                self.robots = robots;
            })
            .fail(function (data) {
                console.log('Error:', data);
            });
        },
        selectRobot: function(robot) {
            this.robot = robot;
            this.activeRobot = robot;
            this.robot.connected = false;
            this.hasSelectedRobot = true;

            this.loadRobot(robot);
        },
        loadRobot: function(robot) {
            this.robot.onConnected = this.onConnect;
            this.robot.onDisconnected = this.onDisconnected;
            this.robot.onDisconnected = this.onDisconnected;
            this.robot.onStateChange = this.onStateChange;
            
            this.robot.connect();
        },
        onConnect: function(test) {
            this.robot.connected = true;
            this.connected = true;

            this.loadMapsTimer = setInterval(this.loadMaps, 1000);
        },
        onDisconnected: function() {
            this.robot.connected = false;
            this.connected = false;
            this.hasSelectedRobot = false;
        },
        onStateChange: function() {
            this.state.details = this.robot.state.details;
            this.state.availableCommands = this.robot.state.availableCommands;
            this.state.alert = this.robot.state.alert;
        },
        loadMaps: function() {
            if(!this.robot.maps) {
                return;
            }
            
            clearInterval(this.loadMapsTimer);

            var self = this;

            this.robot.maps().done(function (data) {
                if(!data['maps'] || data['maps'].length === 0) {
                    self.mapLoadingMessage = 'No maps yet...start a cleaning job!';
                }

                var mapId = data["maps"][0]["id"];
                self.robot.mapDetails(mapId).done(function (data) {
                    self.mapURL = data["url"];
                }).fail(function (data) {
                    self.mapLoadingMessage = data;
                });
            }).fail(function (data) {
                self.mapLoadingMessage = data;
            });
        }
    },
    created: function() {
        this.loadRobots();
    }
}
</script>

<style>
.map {
    margin-top: 20px;
}

.map img {
    max-width: 100%;
}
</style>
