import React, {Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;
class Organization extends Component {
   onSelect = (selectedKeys, info) => {

  }
  onCheck = (checkedKeys, info) => {

  }
  render() {
    return (
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        <TreeNode title="松堡公司" key="0-0">
          <TreeNode title="生产部" key="0-0-0">
            <TreeNode title="前台" key="0-0-0-0" />
            <TreeNode title="后台" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="销售部" key="0-0-1">
            <TreeNode title={<span style={{ color: '#08c' }}>销售人员</span>} key="0-0-1-0" />
          </TreeNode>
        </TreeNode>
      </Tree>
    );
  }

}
export default Organization