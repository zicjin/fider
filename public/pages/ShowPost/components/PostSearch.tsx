import * as React from "react";
import { Post, PostStatus } from "@fider/models";
import { actions } from "@fider/services";
import { DropDown, DropDownItem } from "@fider/components";

interface PostSearchProps {
  exclude?: number[];
  onChanged(postNumber: number): void;
}

interface PostSearchState {
  posts: Post[];
}

export class PostSearch extends React.Component<PostSearchProps, PostSearchState> {
  private timer?: number;

  constructor(props: PostSearchProps) {
    super(props);
    this.state = {
      posts: []
    };
    this.search("");
  }

  private onSearchChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.search(e.currentTarget.value);
  };

  private onChange = (item: DropDownItem) => {
    this.props.onChanged(item.value as number);
  };

  private search = (searchQuery: string) => {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      actions.searchPosts({ query: searchQuery }).then(res => {
        const posts =
          this.props.exclude && this.props.exclude.length > 0
            ? res.data.filter(i => this.props.exclude!.indexOf(i.number) === -1)
            : res.data;
        this.setState({ posts });
      });
    }, 200);
  };

  private returnAll = (options: DropDownItem[], value: string) => options;

  public render() {
    const items = this.state.posts.map(p => {
      const status = PostStatus.Get(p.status);
      return {
        label: p.title,
        value: p.number,
        render: (
          <>
            <span className="votes">
              <i className="caret up icon" />
              {p.votesCount}
            </span>
            <span className={`status-label status-${status.value}`}>{status.title}</span>
            {p.title}
          </>
        )
      };
    });

    return (
      <DropDown
        className="c-post-search"
        searchable={true}
        items={items}
        placeholder="Search original post"
        onChange={this.onChange}
        onSearchChange={this.onSearchChange}
      />
    );
  }
}