const app = require('../index');

const port = process.env.PORT;

app.listen(port, () => console.log(`listening port ${port}`));
