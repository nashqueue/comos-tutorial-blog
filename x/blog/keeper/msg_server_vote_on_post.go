package keeper

import (
	"context"

	"blog/x/blog/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) VoteOnPost(goCtx context.Context, msg *types.MsgVoteOnPost) (*types.MsgVoteOnPostResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgVoteOnPostResponse{}, nil
}
