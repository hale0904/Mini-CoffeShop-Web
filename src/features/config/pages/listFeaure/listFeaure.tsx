import React, { useEffect, useRef, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Tree, Spin } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import type { DTOFeature } from '../../dtos/dtoFeature.dto';
import type { DTOMenu } from '../../dtos/dtoMenu.dto';
import { GetListFeatureMenuService } from '../../services/featureMenu.service';

function ListFeature() {
  const calledRef = useRef(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    APiGetListFeatureMenu();
  }, []);

  function APiGetListFeatureMenu() {
    setLoading(true);
    GetListFeatureMenuService()
      .then((res) => {
        const data: DTOFeature[] = res.data;

        const convertToTree = (features: DTOFeature[]): TreeDataNode[] => {
          return features.map((feature) => ({
            title: feature.name,
            key: feature.code,
            children: feature.listMenu.map((menu) => ({
              title: menu.name,
              key: menu.code,
            })),
          }));
        };

        setTreeData(convertToTree(data));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Get list feature menu: ', error);
      });
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <Spin spinning={loading}>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      />
    </Spin>
  );
}

export default ListFeature;
