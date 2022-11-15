import React from 'react';

const Create = () => {
  return (
    <div>
        <h2>Add New Post</h2>
        <form method="POST" action="/create">
          <div>
              <label for="title">Title:</label>
              <input type="text" id="title" name="title" value="" required/>
          </div>
          <div>
              <label for="title">Description:</label>
              <input type="text" id="describe" name="describe" value="" required/>
          </div>
          <div>
              <label for="title">Category:</label>
              <input type="text" id="category" name="category" value="" required/>
          </div>
          <input type="submit" value="Create"/>
        </form>
    </div>
  );
};

export default Create;
