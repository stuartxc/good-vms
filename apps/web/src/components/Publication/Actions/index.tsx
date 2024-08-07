import type { AnyPublication } from '@good/lens';
import type { FC } from 'react';

import Donate from '@components/Publication/Actions/Donate';
import { GOOD_DONATION } from '@good/data/constants';
import { FeatureFlag } from '@good/data/feature-flags';
import getPublicationViewCountById from '@good/helpers/getPublicationViewCountById';
import isOpenActionAllowed from '@good/helpers/isOpenActionAllowed';
import { isMirrorPublication } from '@good/helpers/publicationHelpers';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import isFeatureAvailable from '@helpers/isFeatureAvailable';
import { memo } from 'react';
import useReferrers from 'src/hooks/useReferrers';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';

import OpenAction from '../OpenAction';
import Comment from './Comment';
import Like from './Like';
import Mod from './Mod';
import Refer from './Refer';
import ShareMenu from './Share';
import Tip from './Tip';
import Views from './Views';

interface PublicationActionsProps {
  publication: AnyPublication;
  showCount?: boolean;
}

const PublicationActions: FC<PublicationActionsProps> = ({
  publication,
  showCount = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { publicationViews } = useImpressionsStore();
  const hasOpenAction = (targetPublication.openActionModules?.length || 0) > 0;

  const canAct =
    hasOpenAction && isOpenActionAllowed(targetPublication.openActionModules);
  const views = getPublicationViewCountById(
    publicationViews,
    targetPublication.id
  );
  const { error, loading, referrers, rootPublicationId } = useReferrers(
    targetPublication.id
  );
  const canRefer =
    !loading && !error && referrers.length > 0 && rootPublicationId;

  const canDonate =
    hasOpenAction &&
    targetPublication.openActionModules.some(
      (module) =>
        module.__typename === 'UnknownOpenActionModuleSettings' &&
        module.contract.address.toLowerCase() === GOOD_DONATION.toLowerCase()
    );

  return (
    <span
      className="-ml-2 mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 sm:gap-8"
      onClick={stopEventPropagation}
    >
      <Comment publication={targetPublication} showCount={showCount} />
      <ShareMenu publication={publication} showCount={showCount} />
      <Like publication={targetPublication} showCount={showCount} />
      {canAct ? (
        <OpenAction publication={targetPublication} showCount={showCount} />
      ) : null}
      <Tip publication={targetPublication} showCount={showCount} />
      {views > 0 ? <Views showCount={showCount} views={views} /> : null}
      {canRefer ? (
        <Refer
          profileId={targetPublication.by.id}
          referrers={referrers}
          rootPublicationId={rootPublicationId}
        />
      ) : null}
      {canDonate && <Donate publication={targetPublication} />}
      {isFeatureAvailable(FeatureFlag.Gardener) ? (
        <Mod isFullPublication={showCount} publication={targetPublication} />
      ) : null}
    </span>
  );
};

export default memo(PublicationActions);
