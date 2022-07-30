package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgVoteOnPost = "vote_on_post"

var _ sdk.Msg = &MsgVoteOnPost{}

func NewMsgVoteOnPost(creator string, index string, upvotes string, downvotes string) *MsgVoteOnPost {
	return &MsgVoteOnPost{
		Creator:   creator,
		Index:     index,
		Upvotes:   upvotes,
		Downvotes: downvotes,
	}
}

func (msg *MsgVoteOnPost) Route() string {
	return RouterKey
}

func (msg *MsgVoteOnPost) Type() string {
	return TypeMsgVoteOnPost
}

func (msg *MsgVoteOnPost) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgVoteOnPost) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgVoteOnPost) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
