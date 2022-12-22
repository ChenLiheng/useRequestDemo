/**
 * desc: 如果 options 中存在 `ref`，则在滚动到底部时，自动触发 loadMore。当然此时你必须设置 `isNoMore`, 以便让 `useRequest` 知道何时停止。
 */
import { useRef } from 'react';
import { useRequest } from 'taro-hooks';

import { View, ScrollView } from '@tarojs/components';
import { AtButton, AtList, AtListItem } from 'taro-ui';

import dataSource from "./data";

const asyncFn = ({ pageSize, offset }: any): Promise<any> =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log('加载下一页', offset)
      resolve({
        total: dataSource.length,
        list: dataSource.slice(offset, offset + pageSize),
      });
    }, 1000);
  });

const LoadMoreRequest = () => {
  const containerRef = useRef(null);
  const { data, loading, loadingMore, reload, loadMore, noMore } = useRequest(
    (d: any | undefined) =>
      asyncFn({
        offset: d?.list?.length || 0,
        pageSize: 3,
      }),
    {
      loadMore: true,
      ref: containerRef,
      isNoMore: (d: any) => (d ? d.list.length >= d.total : false),
    },
  );

  const { list = [] } = data || {};

  return (
    <View>
      <ScrollView
        ref={containerRef}
        style={{ height: '250px' }}
        scrollY
        onScrollToLower={() => console.log('scrollView 触底了...')}
        scrollWithAnimation
      >
        <AtButton customStyle={{ margin: '10px 0' }} onClick={reload}>
          {loading ? 'loading' : 'Reload'}
        </AtButton>

        <AtList>
          {list?.map(({ id, title }) => (
            <AtListItem key={id} title={title} />
          ))}
        </AtList>
        {!noMore && (
          <AtButton onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading more...' : 'Click to load more'}
          </AtButton>
        )}
        {noMore && <View>No more data</View>}
        <View style={{ textAlign: 'center', fontSize: 15 }}>
          total: {data?.total}
        </View>
      </ScrollView>
    </View>
  );
};

export default LoadMoreRequest;