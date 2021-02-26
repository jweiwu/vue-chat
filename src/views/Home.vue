<template>
  <v-app id="chat">
    <v-system-bar app>
      <!-- <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon> -->
    </v-system-bar>

    <v-app-bar app clipped-right flat height="72">
      <v-spacer></v-spacer>
      <v-responsive max-width="156">
        <template>
          <div class="text-center">
            <v-dialog v-model="renameDialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary lighten-1" v-bind="attrs" v-on="on">{{
                  name
                }}</v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Rename
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Name*"
                          v-model="name"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="renameDialog = false">
                    Close
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="sendName">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-responsive>
    </v-app-bar>

    <v-navigation-drawer app width="200">
      <v-sheet color="grey lighten-5" height="128" width="100%"></v-sheet>

      <v-list class="p-5" shaped>
        <v-list-item v-for="u in users" :key="u.id" link>
          <v-list-item-content>
            <v-list-item-title>{{ u.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fill-height fluid>
        <v-row align="end" style="height: 100%;">
          <v-list
            flat
            dense
            style="overflow-y: auto; width: 100%; max-height: 500px; margin-top: 72px;"
          >
            <v-list-item>Start to chat!</v-list-item>
            <v-list-item v-for="(record, index) in message" :key="index">
              {{ record.name }}: {{ record.text }}
            </v-list-item>
          </v-list>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app height="72" inset>
      <v-text-field
        background-color="grey lighten-1"
        v-model="text"
        @keydown="sendMessage"
        autofocus
        dense
        flat
        hide-details
        rounded
        solo
      ></v-text-field>
    </v-footer>
  </v-app>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import SocketIO from 'socket.io-client';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      socket: null,
      name: 'noname',
      text: '',
      renameDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      users: 'chat/users',
      message: 'chat/message',
    }),
  },
  methods: {
    connectSocket() {
      this.socket = SocketIO.connect('ws://localhost:4000', {
        query: `name=${this.name}`,
      });
      this.socket.on('connect', this.handleSocketConnect);
      this.socket.on('disconnect', this.handleSocketDisconnect);
      this.socket.on('message', this.handleSocketMessage);
      this.socket.on('users', this.handleSocketUsers);
    },
    closeSocket() {
      this.socket.close();
    },
    sendMessage(e) {
      const msg = this.text.trim();
      if (e.keyCode === 13 && msg.length > 0) {
        this.socket.emit('message', { name: this.name, text: msg });
        this.text = '';
      }
    },
    sendName() {
      this.socket.emit('users', this.name);
      this.renameDialog = false;
    },
    handleSocketConnect() {
      console.log('Socket connected');
    },
    handleSocketDisconnect() {
      console.log('Socket disconnected');
      this.$store.dispatch('chat/clearMessage');
    },
    handleSocketMessage(message) {
      console.log('Received message', message);
      this.$store.dispatch('chat/addMessage', message);
    },
    handleSocketUsers(users) {
      console.log('Received user list', users);
      this.$store.dispatch('chat/updateUsers', users);
    },
  },
  mounted() {
    this.connectSocket();
  },
  beforeDestroy() {
    this.socket.close();
  },
  // created() {
  //   this.$store.dispatch('chat/getMessage');
  // },
};
</script>
