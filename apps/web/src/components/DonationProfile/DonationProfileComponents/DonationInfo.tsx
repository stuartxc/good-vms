import type { Image as LensImage, Profile } from '@good/lens';
import getAvatar from '@good/helpers/getAvatar';
import getLennyURL from '@good/helpers/getLennyURL';
import { Image } from '@good/ui';
import React from 'react';
import styled from 'styled-components';
import { Post } from '@good/lens';
import { PublicationMetadata } from '@lens-protocol/metadata';
import getPublicationData from '@good/helpers/getPublicationData';
import formatDate from '@good/helpers/datetime/formatDate';
import getProfile from '@good/helpers/getProfile';
import getPro from '@good/helpers/api/getPro';

interface DonationInfoProps {
  post?: Post;
  updateImages?: (string | LensImage)[];
}

const DonationInfoContainer = styled.div`
  margin-bottom: 20px;
`;

const DonationInfo: React.FC<DonationInfoProps> = ({
  post,
  updateImages = []
}) => {

  const profile = getProfile(post.by);


  const Avatar = () => (
    <Image
    alt={profile.displayName}
    className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
    height={10}
    src={getAvatar(post?.by)}
    width={10}
  />
  );

  const donationMetadata = post?.metadata;

  const postContent = donationMetadata?.content ?? '';
  const postAttachments = donationMetadata?.attachments ?? [];
  const postAsset = donationMetadata?.asset;
  const date = formatDate(post?.createdAt);

  const hasAttachments = postAttachments.length > 0 || !!postAsset;

  const hasUpdates = updateImages.length > 0;

  return (
    <DonationInfoContainer className="items-center justify-center">
      <div className="missionText">
        <div className="mb-3 flex text-lg text-black dark:text-white">
          <Avatar />
          <span className="m-auto ml-5 text-center">
            {post?.by.handle?.localName} is organizing this fundraiser
          </span>
          
        </div>
        <div className="mb-3 text-lg text-black dark:text-white">
          Mission:
        </div>
        <div className="mb-3">
          {postContent}
        </div>
      </div>

      <div className="updatesContainer">
        <div className="updatesText mb-5">
          <div className="mb-3 text-lg text-black dark:text-white">
            Updates:
          </div>
          {hasUpdates ? (
            <>
              <div className="mb-3">
                {updateImages.map((image, index) => (
                  <img
                    alt={`Image ${index + 1}`}
                    className="h-auto w-full rounded-lg"
                    key={index}
                    src={typeof image === 'string' ? image : image.uri}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="mb-3">
                No new updates
            </div>
          )}
        </div>
      </div>
    </DonationInfoContainer>
  );
};

export default DonationInfo;
