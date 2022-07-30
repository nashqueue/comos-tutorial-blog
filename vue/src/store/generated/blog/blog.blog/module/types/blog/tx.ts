/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "blog.blog";

export interface MsgCreatePost {
  creator: string;
  title: string;
  body: string;
}

export interface MsgCreatePostResponse {
  id: number;
}

export interface MsgUpdatePost {
  creator: string;
  index: string;
  body: string;
}

export interface MsgUpdatePostResponse {}

export interface MsgVoteOnPost {
  creator: string;
  index: string;
  upvotes: string;
  downvotes: string;
}

export interface MsgVoteOnPostResponse {
  upvotes: number;
  downvotes: number;
}

const baseMsgCreatePost: object = { creator: "", title: "", body: "" };

export const MsgCreatePost = {
  encode(message: MsgCreatePost, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.body !== "") {
      writer.uint32(26).string(message.body);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreatePost {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreatePost } as MsgCreatePost;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.title = reader.string();
          break;
        case 3:
          message.body = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreatePost {
    const message = { ...baseMsgCreatePost } as MsgCreatePost;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.title !== undefined && object.title !== null) {
      message.title = String(object.title);
    } else {
      message.title = "";
    }
    if (object.body !== undefined && object.body !== null) {
      message.body = String(object.body);
    } else {
      message.body = "";
    }
    return message;
  },

  toJSON(message: MsgCreatePost): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.title !== undefined && (obj.title = message.title);
    message.body !== undefined && (obj.body = message.body);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreatePost>): MsgCreatePost {
    const message = { ...baseMsgCreatePost } as MsgCreatePost;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    } else {
      message.title = "";
    }
    if (object.body !== undefined && object.body !== null) {
      message.body = object.body;
    } else {
      message.body = "";
    }
    return message;
  },
};

const baseMsgCreatePostResponse: object = { id: 0 };

export const MsgCreatePostResponse = {
  encode(
    message: MsgCreatePostResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreatePostResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreatePostResponse } as MsgCreatePostResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreatePostResponse {
    const message = { ...baseMsgCreatePostResponse } as MsgCreatePostResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    return message;
  },

  toJSON(message: MsgCreatePostResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgCreatePostResponse>
  ): MsgCreatePostResponse {
    const message = { ...baseMsgCreatePostResponse } as MsgCreatePostResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    return message;
  },
};

const baseMsgUpdatePost: object = { creator: "", index: "", body: "" };

export const MsgUpdatePost = {
  encode(message: MsgUpdatePost, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.index !== "") {
      writer.uint32(18).string(message.index);
    }
    if (message.body !== "") {
      writer.uint32(26).string(message.body);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgUpdatePost {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgUpdatePost } as MsgUpdatePost;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.index = reader.string();
          break;
        case 3:
          message.body = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdatePost {
    const message = { ...baseMsgUpdatePost } as MsgUpdatePost;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.index !== undefined && object.index !== null) {
      message.index = String(object.index);
    } else {
      message.index = "";
    }
    if (object.body !== undefined && object.body !== null) {
      message.body = String(object.body);
    } else {
      message.body = "";
    }
    return message;
  },

  toJSON(message: MsgUpdatePost): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.index !== undefined && (obj.index = message.index);
    message.body !== undefined && (obj.body = message.body);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgUpdatePost>): MsgUpdatePost {
    const message = { ...baseMsgUpdatePost } as MsgUpdatePost;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.index !== undefined && object.index !== null) {
      message.index = object.index;
    } else {
      message.index = "";
    }
    if (object.body !== undefined && object.body !== null) {
      message.body = object.body;
    } else {
      message.body = "";
    }
    return message;
  },
};

const baseMsgUpdatePostResponse: object = {};

export const MsgUpdatePostResponse = {
  encode(_: MsgUpdatePostResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgUpdatePostResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgUpdatePostResponse } as MsgUpdatePostResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgUpdatePostResponse {
    const message = { ...baseMsgUpdatePostResponse } as MsgUpdatePostResponse;
    return message;
  },

  toJSON(_: MsgUpdatePostResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgUpdatePostResponse>): MsgUpdatePostResponse {
    const message = { ...baseMsgUpdatePostResponse } as MsgUpdatePostResponse;
    return message;
  },
};

const baseMsgVoteOnPost: object = {
  creator: "",
  index: "",
  upvotes: "",
  downvotes: "",
};

export const MsgVoteOnPost = {
  encode(message: MsgVoteOnPost, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.index !== "") {
      writer.uint32(18).string(message.index);
    }
    if (message.upvotes !== "") {
      writer.uint32(26).string(message.upvotes);
    }
    if (message.downvotes !== "") {
      writer.uint32(34).string(message.downvotes);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgVoteOnPost {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgVoteOnPost } as MsgVoteOnPost;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.index = reader.string();
          break;
        case 3:
          message.upvotes = reader.string();
          break;
        case 4:
          message.downvotes = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgVoteOnPost {
    const message = { ...baseMsgVoteOnPost } as MsgVoteOnPost;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.index !== undefined && object.index !== null) {
      message.index = String(object.index);
    } else {
      message.index = "";
    }
    if (object.upvotes !== undefined && object.upvotes !== null) {
      message.upvotes = String(object.upvotes);
    } else {
      message.upvotes = "";
    }
    if (object.downvotes !== undefined && object.downvotes !== null) {
      message.downvotes = String(object.downvotes);
    } else {
      message.downvotes = "";
    }
    return message;
  },

  toJSON(message: MsgVoteOnPost): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.index !== undefined && (obj.index = message.index);
    message.upvotes !== undefined && (obj.upvotes = message.upvotes);
    message.downvotes !== undefined && (obj.downvotes = message.downvotes);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgVoteOnPost>): MsgVoteOnPost {
    const message = { ...baseMsgVoteOnPost } as MsgVoteOnPost;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.index !== undefined && object.index !== null) {
      message.index = object.index;
    } else {
      message.index = "";
    }
    if (object.upvotes !== undefined && object.upvotes !== null) {
      message.upvotes = object.upvotes;
    } else {
      message.upvotes = "";
    }
    if (object.downvotes !== undefined && object.downvotes !== null) {
      message.downvotes = object.downvotes;
    } else {
      message.downvotes = "";
    }
    return message;
  },
};

const baseMsgVoteOnPostResponse: object = { upvotes: 0, downvotes: 0 };

export const MsgVoteOnPostResponse = {
  encode(
    message: MsgVoteOnPostResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.upvotes !== 0) {
      writer.uint32(8).uint64(message.upvotes);
    }
    if (message.downvotes !== 0) {
      writer.uint32(16).uint64(message.downvotes);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgVoteOnPostResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgVoteOnPostResponse } as MsgVoteOnPostResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.upvotes = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.downvotes = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgVoteOnPostResponse {
    const message = { ...baseMsgVoteOnPostResponse } as MsgVoteOnPostResponse;
    if (object.upvotes !== undefined && object.upvotes !== null) {
      message.upvotes = Number(object.upvotes);
    } else {
      message.upvotes = 0;
    }
    if (object.downvotes !== undefined && object.downvotes !== null) {
      message.downvotes = Number(object.downvotes);
    } else {
      message.downvotes = 0;
    }
    return message;
  },

  toJSON(message: MsgVoteOnPostResponse): unknown {
    const obj: any = {};
    message.upvotes !== undefined && (obj.upvotes = message.upvotes);
    message.downvotes !== undefined && (obj.downvotes = message.downvotes);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgVoteOnPostResponse>
  ): MsgVoteOnPostResponse {
    const message = { ...baseMsgVoteOnPostResponse } as MsgVoteOnPostResponse;
    if (object.upvotes !== undefined && object.upvotes !== null) {
      message.upvotes = object.upvotes;
    } else {
      message.upvotes = 0;
    }
    if (object.downvotes !== undefined && object.downvotes !== null) {
      message.downvotes = object.downvotes;
    } else {
      message.downvotes = 0;
    }
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  CreatePost(request: MsgCreatePost): Promise<MsgCreatePostResponse>;
  UpdatePost(request: MsgUpdatePost): Promise<MsgUpdatePostResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  VoteOnPost(request: MsgVoteOnPost): Promise<MsgVoteOnPostResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  CreatePost(request: MsgCreatePost): Promise<MsgCreatePostResponse> {
    const data = MsgCreatePost.encode(request).finish();
    const promise = this.rpc.request("blog.blog.Msg", "CreatePost", data);
    return promise.then((data) =>
      MsgCreatePostResponse.decode(new Reader(data))
    );
  }

  UpdatePost(request: MsgUpdatePost): Promise<MsgUpdatePostResponse> {
    const data = MsgUpdatePost.encode(request).finish();
    const promise = this.rpc.request("blog.blog.Msg", "UpdatePost", data);
    return promise.then((data) =>
      MsgUpdatePostResponse.decode(new Reader(data))
    );
  }

  VoteOnPost(request: MsgVoteOnPost): Promise<MsgVoteOnPostResponse> {
    const data = MsgVoteOnPost.encode(request).finish();
    const promise = this.rpc.request("blog.blog.Msg", "VoteOnPost", data);
    return promise.then((data) =>
      MsgVoteOnPostResponse.decode(new Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
