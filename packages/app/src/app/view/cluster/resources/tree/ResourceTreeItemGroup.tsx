import {testMarks} from "app/view/dataTest";
import type {Group} from "app/view/cluster/types";

import {ResourceTreeItemPrimitive} from "./ResourceTreeItemPrimitive";
import {ResourceTreeItemCompound} from "./ResourceTreeItemCompound";
import {ResourceTreeItemFenceDevice} from "./ResourceTreeItemFenceDevice";
import {ResourceTreeCellName} from "./ResourceTreeCellName";
import {ResourceTreeCellType} from "./ResourceTreeCellType";
import {ResourceTreeCellStatus} from "./ResourceTreeCellStatus";

const {group: groupMark} = testMarks.cluster.resources.tree;

export const ResourceTreeItemGroup = ({
  group,
  nestingLevel,
}: {
  group: Group;
  nestingLevel: 0 | 1;
}) => {
  return (
    <ResourceTreeItemCompound
      resourceId={group.id}
      nestingLevel={nestingLevel}
      idCell={
        <ResourceTreeCellName resourceId={group.id} {...groupMark.id.mark} />
      }
      typeCell={<ResourceTreeCellType type="Group" {...groupMark.type.mark} />}
      statusCell={
        <ResourceTreeCellStatus
          status={group.status}
          {...groupMark.status.mark}
        />
      }
      {...groupMark.mark}
    >
      {group.resources.map(resource =>
        resource.itemType === "fence-device" ? (
          <ResourceTreeItemFenceDevice
            key={resource.id}
            fenceDevice={resource}
            nestingLevel={(1 + nestingLevel) as 1 | 2}
          />
        ) : (
          <ResourceTreeItemPrimitive
            key={resource.id}
            primitive={resource}
            nestingLevel={(1 + nestingLevel) as 1 | 2}
          />
        ),
      )}
    </ResourceTreeItemCompound>
  );
};
