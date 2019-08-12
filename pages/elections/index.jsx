/**
 * This page shows all the elections.
 * If a election id is passed in, it shows the nomination/voting page accordingly
 */

import React from 'react';

import ElectionsLayout from '../../layouts/ElectionsLayout';
import ElectionsList from '../../components/ElectionsList';

const ElectionsPage = () => (
  <ElectionsLayout>
    <ElectionsList />
  </ElectionsLayout>
);

export default ElectionsPage;
