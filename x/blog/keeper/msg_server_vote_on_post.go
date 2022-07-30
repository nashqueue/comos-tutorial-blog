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
	upvotes, err := strconv.ParseUint(msg.Upvotes, 10, 64)
	if err == nil {
		fmt.Printf("%d of type %T", upvotes, upvotes)
	}
	downvotes, err := strconv.ParseUint(msg.Downvotes, 10, 64)
	if err == nil {
		fmt.Printf("%d of type %T", downvotes, downvotes)
	}
	//add new upvotes and downvotes
	post.Upvotes += upvotes
	post.Downvotes += downvotes

	//update the new post
	k.SetPost(ctx, post)

	return &types.MsgVoteOnPostResponse{Upvotes: post.Upvotes, Downvotes: post.Downvotes}, nil
}
