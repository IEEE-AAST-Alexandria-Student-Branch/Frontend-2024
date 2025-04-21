import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase/config';
import { toggleFollow } from '../../utils';

interface FollowButtonProps {
    targetUserData: any;
    currentUserData: any;
    targetUserId: string;
    currentUserId: string;
    setTargetFollowers: (userId: string, updatedFollowers: string[]) => void;
    setCurrentFollowing: (userId: string, updatedFollowing: string[]) => void;
    className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
    targetUserData,
    currentUserData,
    targetUserId,
    currentUserId,
    setTargetFollowers,
    setCurrentFollowing,
    className = "",

}) => {

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    
      useEffect(() => {
        if (auth.currentUser) {
          setIsEmailVerified(auth.currentUser.emailVerified);
        }
      }, [auth.currentUser]);
      const canFollow=(currentUserId&&isEmailVerified)?true:false;
    return (
        <button
        className={`bg-white text-black text-[12pt] font-semibold font-[SF-Pro-Text-Medium] border-none cursor-pointer w-24 sm:w-[140px] h-[40px] rounded-full ${className}`}
            onClick={() => {
                if(canFollow){
                    toggleFollow(
                        targetUserData,
                        currentUserData,
                        targetUserId,
                        currentUserId,
                        setTargetFollowers,
                        setCurrentFollowing
                    );
                }

            }}
        >
            {canFollow ? (
                currentUserId && targetUserData?.followers.includes(currentUserId) ? (
                    "Unfollow"
                ) : (
                    "Follow"
                )
            ) : (
                "Verify Email to Follow"
            )}
        </button>
    );
};
