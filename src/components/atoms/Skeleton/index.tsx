import React from 'react';
import MaterialSkeleton from '@material-ui/lab/Skeleton';
import times from 'lodash.times';
import uniqueid from 'lodash.uniqueid';

type Props = {
  variant: 'text' | 'rect' | 'circle';
  width: number;
  height: number;
  repeat: number;
};

const Skeleton: React.FunctionComponent<Props> = ({
  variant = 'text',
  width,
  height,
  repeat = 1,
}: Props) => {
  return times(repeat, () => (
    <MaterialSkeleton
      key={uniqueid('id_')}
      variant={variant}
      width={width}
      height={height}
    />
  )).map((elem: JSX.Element) => elem);
};

export default Skeleton;
