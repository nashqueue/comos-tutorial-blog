package keeper

import (
	"blog/x/blog/types"
	"encoding/binary"
	"fmt"
	"strconv"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
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

// SetPost updates a post at its index
func (k Keeper) SetPost(ctx sdk.Context, post types.Post) {
	// Get the store
	store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.PostKey))

	// Convert the post ID into bytes
	byteKey := make([]byte, 8)
	binary.BigEndian.PutUint64(byteKey, post.Id)

	// Marshal the post into bytes
	newValue := k.cdc.MustMarshal(&post)

	// Insert the post bytes using post ID as a key
	store.Set(byteKey, newValue)
}
