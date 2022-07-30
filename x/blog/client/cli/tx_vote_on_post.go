package cli

import (
	"strconv"

	"blog/x/blog/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdVoteOnPost() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "vote-on-post [index] [upvotes] [downvotes]",
		Short: "Broadcast message voteOnPost",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argIndex := args[0]
			argUpvotes := args[1]
			argDownvotes := args[2]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgVoteOnPost(
				clientCtx.GetFromAddress().String(),
				argIndex,
				argUpvotes,
				argDownvotes,
			)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
