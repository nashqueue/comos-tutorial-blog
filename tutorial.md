# Build a blog

In this tutorial, you create a blockchain with a module that lets you write to and read data from the blockchain. This module implements create, read and update functionalities for a blog-like application. The end user will be able to submit new blog posts and show a list of blog posts on the blockchain. Furthermore will the user be able to upvote and downvote the post. 

This tutorial builds on knowlege and skills developed in the earlier tutorials in the Ignite CLI Developer Tutorials. Before you start this building your nameservice app, we recommend that you complete these foundational tutorials:

- [Install Ignite CLI](../01-install.md)
- [Hello, World](../02-hello.md)

> The purpose of this tutorial is to guide you through the implementation of a complete feedback loop: submitting data and reading this data back from the blockchain.
By completing this tutorial, you will learn about:

* Scaffolding a Cosmos SDK message
* Defining new types in protocol buffer files
* Implementing keeper methods to write data to the store
* Reading data from the store and return it as a result of a query
* Using the blockchain's CLI to broadcast transactions and query the blockchain


**Note:** All the functions in this chapter can be scaffolded with a single command but instead you will learn how to add each functionality individually. 

## Prerequisites 

This series of blog tutorials is based on a specific version of Ignite CLI, so to install Ignite CLI v0.22.2 use the following command:

```bash
curl https://get.ignite.com/cli@v0.22.2! | bash
```

## Create your blog chain

First, create a new blockchain.

Open a terminal and navigate to a directory where you have permissions to create files. To create your Cosmos SDK blockchain, run this command:

```bash
ignite scaffold chain blog
```

The `blog` directory is created with the default directory structure.

## High-level transaction review

So far, you have learned how to modify proto files to define a new API endpoint and modify a keeper query function to return static data back to the user. Of course, a keeper can do more than return a string of data. Its purpose is to manage access to the state of the blockchain.

You can think of the state as being a collection of key-value stores. Each module is responsible for its own store. Changes to the store are triggered by transactions that are signed and broadcasted by users. Each transaction contains Cosmos SDK messages (not to be confused with proto `message`). When a transaction is processed, each message gets routed to its module. A module has message handlers that process messages. Processing a message can trigger changes in the state.

## Create message types

A Cosmos SDK message contains information that can trigger changes in the state of a blockchain.

Now, you are ready to implement these Cosmos SDK messages to achieve the desired functionality for your blog chain:

 - `createPost` 
        Allow users to create a post with some title and body.
 - `updatePost`
        Allow post writers to update the body of their posts with a new body.
 - `voteOnPost` 
        Allow useres to upvote and downvote on posts.

### Add the createPost Message

First, change into the `blog` directory:

```bash
cd blog
```


Use the `ignite scaffold message` command to scaffold new messages for your module.

```bash
ignite scaffold message createPost title body
```

The [`ignite scaffold message`](https://docs.ignite.com/cli#ignite-scaffold-message) command accepts the message name (`createPost`) as the first argument and a list of fields (`title` and `body`) as arguments.

The `message` command has created and modified several files:

```bash
modify proto/blog/tx.proto
modify x/blog/client/cli/tx.go
create x/blog/client/cli/tx_create_post.go
modify x/blog/handler.go
create x/blog/keeper/msg_server_create_post.go
modify x/blog/module_simulation.go
create x/blog/simulation/create_post.go
modify x/blog/types/codec.go
create x/blog/types/message_create_post.go
create x/blog/types/message_create_post_test.go
🎉 Created a message `createPost`.
```

### Add the updatePost Message


To create the `updatePost` message for the blog module use:

```bash
ignite scaffold message updatePost index body
```

where:

- updatePost is the message name
- index is the post which the user wants to change
- body is the new text of the post

This `ignite scaffold message` command modifies and creates the same set of files as the `ignite scaffold message` command.

### Add the voteOnPost Message


To create the `voteOnPost` message for the blog module use:

```bash
ignite scaffold message voteOnPost index upvotes downvotes
```

where:

- voteOnPost is the message name
- index is the post on which the user want to vote 
- upvotes is the amount of upvotes the post gets form the user
- downvotes is the amount of downvotes the post gets form the user

This `ignite scaffold message` command modifies and creates the same set of files as the `createPost` and `updatePost` command.

## Updating the proto file

As always, start with a proto file. Inside the `proto/blog/tx.proto` file, the `MsgCreatePost` message has been created. Edit the file to add the line that defines the `id` for `message MsgCreatePostResponse`:

```go
message MsgCreatePost {
  string creator = 1;
  string title = 2;
  string body = 3;
}
message MsgCreatePostResponse {
  uint64 id = 1;
}
```

Furthermore the same sets have been created for the `updatePost` and `voteOnPost` messages. 
Edit the file to add the line that defines the `upvotes` and `downvotes` for `message MsgVoteOnPostResponse`:

```go
message MsgVoteOnPost {
  string creator = 1;
  string index = 2;
  uint64 upvotes = 3;
  uint64 downvotes = 4;
}

message MsgVoteOnPostResponse {
  uint64 upvotes = 1;
  uint64 downvotes = 2;
}
```

## Review the message code

In the same file `proto/blog/tx.proto` review the Cosmos SDK message type with proto `message`. The `MsgCreatePost` has three fields: creator, title, and body. Since the purpose of the `MsgCreatePost` message is to create new posts in the store, the only thing the message needs to return is an ID of a created post. The `CreatePost` rpc was already added to the `Msg` service. The same goes for the `UpdatePost` and `VoteOnPost` rpc:

```go
service Msg {
  rpc CreatePost(MsgCreatePost) returns (MsgCreatePostResponse);
  rpc UpdatePost(MsgUpdatePost) returns (MsgUpdatePostResponse);
  rpc VoteOnPost(MsgVoteOnPost) returns (MsgVoteOnPostResponse);
}
```

Next, look at the `x/blog/handler.go` file. Ignite CLI has added three `case` statements to the `switch` statement inside the `NewHandler` function. This switch statement is responsible for routing messages and calling specific keeper methods based on the type of the message:


```go
func NewHandler(k keeper.Keeper) sdk.Handler {
  //...
  return func(ctx sdk.Context, msg sdk.Msg) (*sdk.Result, error) {
  //...
    switch msg := msg.(type) {
    case *types.MsgCreatePost:
      res, err := msgServer.CreatePost(sdk.WrapSDKContext(ctx), msg)
      return sdk.WrapServiceResult(ctx, res, err)
    case *types.MsgUpdatePost:
      res, err := msgServer.UpdatePost(sdk.WrapSDKContext(ctx), msg)
      return sdk.WrapServiceResult(ctx, res, err)
    case *types.MsgVoteOnPost:
      res, err := msgServer.VoteOnPost(sdk.WrapSDKContext(ctx), msg)
      return sdk.WrapServiceResult(ctx, res, err)
    //...
    }
  }
}
```

The `case *types.MsgCreatePost` statement handles messages of type `MsgCreatePost`, calls the `CreatePost` method, and returns back the response.
The `case *types.MsgUpdatePost` statement handles messages of type `MsgUpdatePost`, calls the `UpdatePost` method, and returns back the response. The `case *types.MsgVoteOnPost` statement handles messages of type `MsgVoteOnPost`, calls the `VoteOnPost` method, and returns back the response.

Every module has a handler function like this to process messages and call keeper methods.

## Define the CreatePost Logic

In the newly scaffolded `x/blog/keeper/msg_server_create_post.go` file, you can see a placeholder implementation of the `CreatePost` function. Right now it does nothing and returns an empty response. For your blog chain, you want the contents of the message (title and body) to be written to the state as a new post.

You need to do two things:

- Create a variable of type `Post` with title and body from the message. Add the initial 0 upvotes and downvotes to the post.
- Append this `Post` to the store

```go
func (k msgServer) CreatePost(goCtx context.Context, msg *types.MsgCreatePost) (*types.MsgCreatePostResponse, error) {
	// Get the context
	ctx := sdk.UnwrapSDKContext(goCtx)
	// Create variable of type Post
	var post = types.Post{
		Creator:   msg.Creator,
		Title:     msg.Title,
		Body:      msg.Body,
		Upvotes:   0,
		Downvotes: 0,
	}
	// Add a post to the store and get back the ID
	id := k.AppendPost(ctx, post)
	// Return the ID of the post
	return &types.MsgCreatePostResponse{Id: id}, nil
}
```

### Define the Post Type 

Define the `Post` type and keeper methods.

When you define the `Post` type in a proto file, Ignite CLI (with the help of `protoc`) takes care of generating the required Go files.

Create the `proto/blog/post.proto` file and define the `Post` message:

```go
syntax = "proto3";
package blog.blog;
option go_package = "blog/x/blog/types";
message Post {
  string creator = 1;
  uint64 id = 2;
  string title = 3; 
  string body = 4; 
  uint64 upvotes = 5;
  uint64 downvotes = 6;
}
```

The contents of the `post.proto` file are standard. The file defines:

- A package name `blog.blog` that is used to identify messages
- The Go package `go_package = "blog/x/blog/types"` where new files are generated 
- The message `message Post`

Continue developing your blog chain.

### Define Keeper Methods

The next step is to define the `AppendPost` keeper method. 

Create the `x/blog/keeper/post.go` file and start thinking about the logic of the function and what you want to call the prefixes. The file will be empty for now.

- To implement `AppendPost` you must first understand how the key store works. You can think of a store as a key-value database where keys are lexicographically ordered. You can loop through keys and use `Get` and `Set` to retrieve and set values based on keys. To distinguish between different types of data that a module can keep in its store, you can use prefixes like `product-` or `post-`.

- To keep a list of posts in what is essentially a key-value store, you need to keep track of the index of the posts you insert. Since both post values and post count (index) values are kept in the store, you can use different prefixes: `Post-value-` and `Post-count-`. 

Then, add these prefixes to the `x/blog/types/keys.go` file in the `const` and add a comment that describes the keys:

```go
const (
  //...
  // Keep track of the index of posts  
  PostKey      = "Post-value-"
  PostCountKey = "Post-count-"
)
```

Your blog is now updated to take these actions when a `Post` message is sent to the `AppendPost` function: 

- Get the number of posts in the store (count)
- Add a post by using the count as an ID
- Increment the count
- Return the count

### Write Data to the Store

Now, after the `import` section in the `x/blog/keeper/post.go` file, draft the `AppendPost` function. You can add these comments to help you visualize what you do next:

```go
// func (k Keeper) AppendPost() uint64 {
// 	 count := k.GetPostCount()
// 	 store.Set()
// 	 k.SetPostCount()
// 	 return count
// }
```

First, implement `GetPostCount`:

```go
func (k Keeper) GetPostCount(ctx sdk.Context) uint64 {
  // Get the store using storeKey (which is "blog") and PostCountKey (which is "Post-count-")
  store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.PostCountKey))
  // Convert the PostCountKey to bytes
  byteKey := []byte(types.PostCountKey)
  // Get the value of the count
  bz := store.Get(byteKey)
  // Return zero if the count value is not found (for example, it's the first post)
  if bz == nil {
    return 0
  }
  // Convert the count into a uint64
  return binary.BigEndian.Uint64(bz)
}
```

Now that `GetPostCount` returns the correct number of posts in the store, implement `SetPostCount`:

```go
func (k Keeper) SetPostCount(ctx sdk.Context, count uint64) {
  // Get the store using storeKey (which is "blog") and PostCountKey (which is "Post-count-")
  store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.PostCountKey))
  // Convert the PostCountKey to bytes
  byteKey := []byte(types.PostCountKey)
  // Convert count from uint64 to string and get bytes
  bz := make([]byte, 8)
  binary.BigEndian.PutUint64(bz, count)
  // Set the value of Post-count- to count
  store.Set(byteKey, bz)
}
```

Now that you have implemented functions for getting the number of posts and setting the post count, at the top of the same `x/blog/keeper/post.go` file, implement the logic behind the `AppendPost` function:

```go
package keeper
import (
  "encoding/binary"
  "github.com/cosmos/cosmos-sdk/store/prefix"
  sdk "github.com/cosmos/cosmos-sdk/types"
  "blog/x/blog/types"
)
func (k Keeper) AppendPost(ctx sdk.Context, post types.Post) uint64 {
  // Get the current number of posts in the store
  count := k.GetPostCount(ctx)
  // Assign an ID to the post based on the number of posts in the store
  post.Id = count
  // Get the store
  store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.PostKey))
  // Convert the post ID into bytes
  byteKey := make([]byte, 8)
  binary.BigEndian.PutUint64(byteKey, post.Id)
  // Marshal the post into bytes
  appendedValue := k.cdc.MustMarshal(&post)
  // Insert the post bytes using post ID as a key
  store.Set(byteKey, appendedValue)
  // Update the post count
  k.SetPostCount(ctx, count+1)
  return count
}
```


🎉 Congratulations. By following these steps, you have implemented all of the code required to create new posts and store them on-chain. Now, when a transaction that contains a message of type `MsgCreatePost` is broadcast, the message is routed to your blog module.

- `x/blog/handler.go` calls `k.CreatePost` which in turn calls `AppendPost`
- `AppendPost` gets the number of posts from the store, adds a post using the count as an ID, increments the count, and returns the ID

Use the `ignite chain build` command to compile your newly implemented keeper. 

´´´
ignite chain build
´´´


## Define UpdatePost logic

In the newly scaffolded `x/blog/keeper/msg_server_update_post.go` file, you can see a placeholder implementation of the `UpdatePost` function. Right now it does nothing and returns an empty response. For your blog chain, you want the contents of the message (body) to be written to the correct post.

You need to do three things:

- Check if the index already exists.
- Check if the sender of the message is the owner of the post.
- Update the new body on the post

```go
func (k msgServer) UpdatePost(goCtx context.Context, msg *types.MsgUpdatePost) (*types.MsgUpdatePostResponse, error) {
	//get the context
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Check if the value exists
	post, isFound := k.GetPost(
		ctx,
		msg.Index,
	)
	if !isFound {
		return nil, sdkerrors.Wrap(sdkerrors.ErrKeyNotFound, "index not set")
	}

	// Check if the the msg creator is the same as the current owner
	if msg.Creator != post.Creator {
		return nil, sdkerrors.Wrap(sdkerrors.ErrUnauthorized, "incorrect owner")
	}

	//update the body
	post.Body = msg.Body

	//store the new post
	k.SetPost(ctx, post)

	return &types.MsgUpdatePostResponse{}, nil
}
```

Add `sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"` to the imports, which provides further context and meaning to a failed execution:

```go 
import (
    //...
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)
```

### Write General Setters and Getters for Posts

First, implement `GetPost` in the `x/blog/keeper/post.go` file: 

```go
// GetPost returns a post from its index
func (k Keeper) GetPost(
	ctx sdk.Context,
	index string,

) (post types.Post, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.PostKey))

	// Convert the string index to uint64 and then to byte
	n, err := strconv.ParseUint(index, 10, 64)
	if err == nil {
		fmt.Printf("%d of type %T", n, n)
	}
	byteKey := make([]byte, 8)
	binary.BigEndian.PutUint64(byteKey, n)

	// Get the value of the count
	postBytes := store.Get(byteKey)

	//retrun an empty post if the index does not exists
	if postBytes == nil {
		return post, false
	}

	//Unmarshal the bytes of the post
	k.cdc.MustUnmarshal(postBytes, &post)
	return post, true
}
```

Add `strconv` and `fmt` to the imports at the top of the file, which handles the string conversion and enables printing in the terminal:

```go 
import (
    //...
	"fmt"
	"strconv"
)
```


Now that `GetPost` returns the correct post in the store at the given index, implement `SetPost` in the same `x/blog/keeper/post.go` file:

```go
// SetPost updates a post at its index
func (k Keeper) SetPost(ctx sdk.Context, post types.Post) {
	// Get the store
	store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.PostKey))

	// Convert the post ID into bytes
	byteKey := make([]byte, 8)
	binary.BigEndian.PutUint64(byteKey, post.Id)

	// Marshal the post into bytes
	postBytes := k.cdc.MustMarshal(&post)

	// Insert the post bytes using post ID as a key
	store.Set(byteKey, postBytes)
}
```

🎉 Congratulations. By following these steps, you have implemented all of the code required to update posts and store them on-chain. Now, when a transaction that contains a message of type `MsgUpdatePost` is broadcast, the message is routed to your blog module.

- `x/blog/handler.go` calls `k.UpdatePost` which in turn calls `GetPost` and `SetPost`. 
- `k.UpdatePost` checks if the post exists and if the caller is allowed to change the body. It then saves the new body on chain. 

Use the `ignite chain build` command to compile your newly implemented keeper. 

´´´
ignite chain build
´´´

## Define VoteOnPost Logic

In the newly scaffolded `x/blog/keeper/msg_server_vote_on_post.go` file, you can see a placeholder implementation of the `VoteOnPost` function. Right now it does nothing and returns an empty response. For your blog chain, you want the contents of the message (upvotes, downvotes) to be added to the upvotes and downvotes of the correct post.

You need to do two things:

- Check if the index already exists.
- Add the new upvotes and downvotes on the post

```go
package keeper

import (
	"context"
	"fmt"
	"strconv"

	"blog/x/blog/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

func (k msgServer) VoteOnPost(goCtx context.Context, msg *types.MsgVoteOnPost) (*types.MsgVoteOnPostResponse, error) {
	//get the context
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Check if the value exists
	post, isFound := k.GetPost(
		ctx,
		msg.Index,
	)
	if !isFound {
		return nil, sdkerrors.Wrap(sdkerrors.ErrKeyNotFound, "index not set")
	}

	//Convert upvotes and downvotes from string to unit64
	upvotes, err := strconv.ParseUint(msg.Upvotes, 10, 64)
	if err == nil {
		fmt.Printf("%d of type %T", upvotes, upvotes)
	}
	downvotes, err := strconv.ParseUint(msg.Downvotes, 10, 64)
	if err == nil {
		fmt.Printf("%d of type %T", downvotes, downvotes)
	}

	//add the new upvotes and downvotes on top of the old ones
	post.Upvotes += upvotes
	post.Downvotes += downvotes

	//update the new post
	k.SetPost(ctx, post)

	return &types.MsgVoteOnPostResponse{Upvotes: post.Upvotes, Downvotes: post.Downvotes}, nil
}
```

🎉 Congratulations. By following these steps, you have implemented all of the code required to vote on posts. Now, when a transaction that contains a message of type `MsgVoteOnPost` is broadcast, the message is routed to your blog module. You already implemented `GetPost` and `SetPost` in the previous steps. 

- `x/blog/handler.go` calls `k.VoteOnPost` which in turn calls `GetPost` and `SetPost`. 
- `k.VoteOnPost` checks if the post exists and then adds the votes on chain. 

Use the `ignite chain build` command to compile your newly implemented keeper. 

´´´
ignite chain build
´´´


## Display posts

Now that you have added the functionality to create posts and broadcast them to our chain, you can add querying.
To display posts, use the `ignite query message` command to scaffold a new query for your module.

```bash
ignite scaffold query posts --response title,body,upvotes,downvotes
```

The [`ignite scaffold query`](https://docs.ignite.com/cli#ignite-scaffold-query) command accepts the query name (`posts`) as the first argument and a list of response fields (`title`, `body`, `upvotes` and `downvotes`) as arguments.

The `query` command has created and modified several files:

```bash
modify proto/blog/query.proto
modify x/blog/client/cli/query.go
create x/blog/client/cli/query_posts.go
create x/blog/keeper/grpc_query_posts.go

🎉 Created a query `posts`.
```


Two components are responsible for querying data:

- An rpc inside `service Query` in a proto file that defines data types and specifies the HTTP API endpoint
- A keeper method that performs the querying from the key-value store

First, review the services and messages in `proto/blog/query.proto`. The `Posts` rpc accepts an empty request and returns an object with four fields: title, body, upvotes and downvotes. Now you can make changes so it can return a list of posts. The list of posts can be long, so add pagination. When pagination is added, the request and response include a page number so you can request a particular page when you know what page has been returned.

To define the types in proto files, make the following updates in `proto/blog/query.proto`:

1. Add the `import`:

```go
import "blog/post.proto";
```

2. Add pagination to the post request:

```go
message QueryPostsRequest {
  // Adding pagination to request
  cosmos.base.query.v1beta1.PageRequest pagination = 1;
}
```

3. Add pagination to the post response:

```go
message QueryPostsResponse {
  // Returning a list of posts
  repeated Post Post = 1;
  // Adding pagination to response
  cosmos.base.query.v1beta1.PageResponse pagination = 2;
}
```

To implement post querying logic in the `x/blog/keeper/grpc_query_posts.go` file, delete the contents of that file and replace it with:

```go
package keeper
import (
  "context"
  
  "github.com/cosmos/cosmos-sdk/store/prefix"
  sdk "github.com/cosmos/cosmos-sdk/types"
  "github.com/cosmos/cosmos-sdk/types/query"  
  "google.golang.org/grpc/codes"
  "google.golang.org/grpc/status"
  "blog/x/blog/types"
)
func (k Keeper) Posts(c context.Context, req *types.QueryPostsRequest) (*types.QueryPostsResponse, error) {
  // Throw an error if request is nil
  if req == nil {
    return nil, status.Error(codes.InvalidArgument, "invalid request")
  }
  // Define a variable that will store a list of posts
  var posts []*types.Post
  // Get context with the information about the environment
  ctx := sdk.UnwrapSDKContext(c)
  // Get the key-value module store using the store key (in our case store key is "chain")
  store := ctx.KVStore(k.storeKey)
  // Get the part of the store that keeps posts (using post key, which is "Post-value-")
  postStore := prefix.NewStore(store, []byte(types.PostKey))
  // Paginate the posts store based on PageRequest
  pageRes, err := query.Paginate(postStore, req.Pagination, func(key []byte, value []byte) error {
    var post types.Post
    if err := k.cdc.Unmarshal(value, &post); err != nil {
      return err
    }
    posts = append(posts, &post)
    return nil
  })
  // Throw an error if pagination failed
  if err != nil {
    return nil, status.Error(codes.Internal, err.Error())
  }
  // Return a struct containing a list of posts and pagination info
  return &types.QueryPostsResponse{Post: posts, Pagination: pageRes}, nil
}
```

## Add gRPC to the module handler

In the `x/blog/module.go` file:

1. Add `"context"` to the imports, don't save the file yet.

```go
import (
	"context"
	// ... other imports
)
```

2. Update the `RegisterGRPCGatewayRoutes` function to register the query handler client:

```go
// RegisterGRPCGatewayRoutes registers the gRPC Gateway routes for the module.
func (AppModuleBasic) RegisterGRPCGatewayRoutes(clientCtx client.Context, mux *runtime.ServeMux) {
	types.RegisterQueryHandlerClient(context.Background(), mux, types.NewQueryClient(clientCtx))
}
```

3. Now that you've modified the file with the two updates, now it's safe to save the file. 

## Use the CLI to create a post

Now that you have implemented logic for creating and querying posts, you can interact with your blog chain using the command line. The blog chain binary is `blogd`.

First, start the chain on your development machine by running the following command in the `blog` directory:

```bash
ignite chain serve
```

The binary is built by the `ignite chain serve` command bit it can also be built by running:

```bash
ignite chain build
```

To create a post at the command line:

```bash
blogd tx blog create-post foo bar --from alice
```

The transaction is output to the terminal. You are prompted to confirm the transaction:

```bash
{"body":{"messages":[{"@type":"/blog.blog.MsgCreatePost","creator":"cosmos1ctxp3pfdtr3sw9udz2ptuh59ce9z0eaa2zvv6w","title":"foo","body":"bar"}],"memo":"","timeout_height":"0","extension_options":[],"non_critical_extension_options":[]},"auth_info":{"signer_infos":[],"fee":{"amount":[],"gas_limit":"200000","payer":"","granter":""}},"signatures":[]}
confirm transaction before signing and broadcasting [y/N]: y
```

Type `y` to sign and broadcast the transaction.

Congratulations, you built a chain binary and used the `blogd` binary CLI to create a blog post.

## Use the CLI to query posts

To query the list of all on-chain posts:

```bash
blogd q blog posts
```

The result: 

```bash
Post:
- body: bar
  creator: cosmos1ctxp3pfdtr3sw9udz2ptuh59ce9z0eaa2zvv6w
  id: "0"
  title: foo
pagination:
  next_key: null
  total: "1"
```

## Conclusion

Congratulations. You have built a blog blockchain! 

You have successfully completed these steps:

* Write blog posts to your chain
* Read from blog posts
* Scaffold a Cosmos SDK message
* Define new types in protocol buffer files
* Write keeper methods to write data to the store
* Register query handlers
* Read data from the store and return it as a result a query
* Use the CLI to broadcast transactions