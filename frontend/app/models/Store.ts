////////////////////////////////////////////////////////////////////////////
//
// Copyright 2023 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import Realm, {BSON, ObjectSchema} from 'realm';

import type {Kiosk} from './Kiosk';

/**
 * A store containing many kiosks.
 */
export class Store extends Realm.Object {
  _id!: BSON.ObjectId;
  name!: string;
  location!: string;
  kiosks!: Realm.List<Kiosk>;

  static schema: ObjectSchema = {
    name: 'Store',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new BSON.ObjectId()},
      name: 'string',
      location: 'string',
      kiosks: 'Kiosk[]',
    },
  };
}
