import { createApp } from 'vue';

const app = createApp({
  data() {
    return {
      email: '',
      password: '',
      headers: [],
    };
  },
  methods: {
    async getHeaders() {
      try {
        const response = await fetch(`/emails?email=${this.email}&password=${this.password}`);
        const headers = await response.json();
        this.headers = headers;
      } catch (error) {
        console.error(error);
      }
    },
  },
  template: `
    <div>
      <h1>Gmail Header Retrieval</h1>
      <form>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
        <br>
        <button type="button" @click="getHeaders">Get Headers</button>
      </form>
      <ul>
        <li v-for="header in headers" :key="header.id">
          <p>{{ header.from }}</p>
          <p>{{ header.subject }}</p>
          <p>{{ header.date }}</p>
        </li>
      </ul>
    </div>
  `,
});

app.mount('#app');
