<template>
    <div class="row">
        <div class="card">
            <div class="card-body">
                <button class="btn btn-primary" v-on:click="login">Connect to Neato Account</button>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function() {
        return {
            user: new Neato.User()
        }
    },
    methods: {
        login: function() {
            this.user.login({
                clientId:    "d242789b96142bf01080fe3453a24b0c34ef386e41e2ca448b288a08d2e773f0",
                scopes:      "control_robots+maps+public_profile",
                redirectUrl: window.location.origin
            });
        }
    }
}
</script>