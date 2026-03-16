export const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 24px;
        background: #ffffff;
        color: #111111;
      }

      h1 {
        margin-bottom: 12px;
      }

      p {
        line-height: 1.6;
      }

      button {
        padding: 10px 14px;
        border: none;
        border-radius: 8px;
        background: #111111;
        color: white;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>Hello world</h1>
    <p>Edit this HTML and click Run.</p>
    <button onclick="alert('It works!')">Click me</button>
  </body>
</html>
`;
