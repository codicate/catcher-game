import { useEffect } from 'react';

import { firestore } from 'utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { recalculateLives, selectRoom } from 'app/roomSlice';

export const useFirebaseSyncState = () => {
  const dispatch = useAppDispatch();
  const { roomInfo } = useAppSelector(selectRoom);

  useEffect(() => {
    const roomDoc = doc(firestore, 'rooms', roomInfo.roomId);

    const unsubSnapshot = onSnapshot(roomDoc, () => {
      dispatch(recalculateLives());
    });

    return () => unsubSnapshot();
  }, [dispatch, roomInfo]);
};