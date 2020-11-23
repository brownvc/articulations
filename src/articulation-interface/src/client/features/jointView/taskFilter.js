const tasks = {
  version_0: ['partnetsim.100079', 'partnetsim.100095', 'partnetsim.100511', 'partnetsim.100513', 'partnetsim.102062', 'partnetsim.101052', 'partnetsim.101057', 'partnetsim.101059', 'partnetsim.101062', 'partnetsim.101085', 'partnetsim.100065', 'partnetsim.100068', 'partnetsim.100078', 'partnetsim.100082', 'partnetsim.100086', 'partnetsim.100092', 'partnetsim.100106', 'partnetsim.100109', 'partnetsim.101982', 'partnetsim.101999', 'partnetsim.101054', 'partnetsim.101095', 'partnetsim.101107', 'partnetsim.101217', 'partnetsim.101260', 'partnetsim.101659', 'partnetsim.101662', 'partnetsim.102401', 'partnetsim.102402', 'partnetsim.103583', 'partnetsim.8867', 'partnetsim.8877', 'partnetsim.8919', 'partnetsim.8961', 'partnetsim.8983', 'partnetsim.8997', 'partnetsim.9016', 'partnetsim.9041', 'partnetsim.9070', 'partnetsim.9107', 'partnetsim.9168', 'partnetsim.35059', 'partnetsim.38516', 'partnetsim.41003', 'partnetsim.41086', 'partnetsim.41452', 'partnetsim.41529', 'partnetsim.45130', 'partnetsim.45176', 'partnetsim.45249', 'partnetsim.45267', 'partnetsim.45323', 'partnetsim.45354', 'partnetsim.45423', 'partnetsim.45444', 'partnetsim.45642', 'partnetsim.102009', 'partnetsim.102016', 'partnetsim.102021', 'partnetsim.102024', 'partnetsim.102025', 'partnetsim.102042', 'partnetsim.101112', 'partnetsim.103575', 'partnetsim.103582', 'partnetsim.103706', 'partnetsim.102004', 'partnetsim.102008', 'partnetsim.103585', 'partnetsim.103713', 'partnetsim.103716', 'partnetsim.103723', 'partnetsim.103729', 'partnetsim.103735', 'partnetsim.103740', 'partnetsim.101374', 'partnetsim.101375', 'partnetsim.101388',  'partnetsim.101407', 'partnetsim.101421', 'partnetsim.101429', 'partnetsim.101437',  'partnetsim.101440', 'partnetsim.101441', 'partnetsim.101445', 'partnetsim.41004', 'partnetsim.41085', 'partnetsim.38516', 'partnetsim.45001', 'partnetsim.45007', 'partnetsim.45087', 'partnetsim.45091', 'partnetsim.45159', 'partnetsim.45164', 'partnetsim.45166', 'partnetsim.45173', 'partnetsim.45177', 'partnetsim.45178', 'partnetsim.45189', 'partnetsim.45203', 'partnetsim.45212', 'partnetsim.45244', 'partnetsim.45247', 'partnetsim.45248', 'partnetsim.45297', 'partnetsim.45305', 'partnetsim.45372', 'partnetsim.45378', 'partnetsim.45384', 'partnetsim.45378', 'partnetsim.45397'],
  training_v1: ['partnetsim.10040', 'partnetsim.10098', 'partnetsim.10101', 'partnetsim.100141', 'partnetsim.100191', 'partnetsim.20985', 'partnetsim.22339', 'partnetsim.26073', 'partnetsim.26525', 'partnetsim.26806', 'partnetsim.10125', 'partnetsim.10213', 'partnetsim.10238', 'partnetsim.10239', 'partnetsim.10243', 'partnetsim.10248', 'partnetsim.10269', 'partnetsim.10270', 'partnetsim.10280', 'partnetsim.10289', 'partnetsim.10305', 'partnetsim.10306', 'partnetsim.10383', 'partnetsim.10626', 'partnetsim.10697', 'partnetsim.10707', 'partnetsim.10885', 'partnetsim.100214', 'partnetsim.100221', 'partnetsim.100664', 'partnetsim.27619', 'partnetsim.28668', 'partnetsim.30238'],
  training_v2: ['partnetsim.1011', 'partnetsim.1028', 'partnetsim.1034', 'partnetsim.1052', 'partnetsim.1053', 'partnetsim.1280', 'partnetsim.1343', 'partnetsim.1370', 'partnetsim.1380', 'partnetsim.1386', 'partnetsim.1401', 'partnetsim.1444', 'partnetsim.1479', 'partnetsim.960', 'partnetsim.1011', 'partnetsim.912', 'partnetsim.862', 'partnetsim.857', 'partnetsim.822', 'partnetsim.2170', 'partnetsim.2115', 'partnetsim.2113', 'partnetsim.2095', 'partnetsim.2084', 'partnetsim.2035', 'partnetsim.1961', 'partnetsim.1903', 'partnetsim.1817', 'partnetsim.1528', 'partnetsim.149']
};

const filterObjects = (objects, taskName) => {
  // If no task name is specified, everything is included.
  if (!taskName) {
    return objects;
  }

  // If the task name isn't found, everything is excluded.
  if (!tasks[taskName]) {
    return [];
  }

  // If the task name is found, filters out everything that's not in the task.
  // This now uses partnetsim IDs.
  const allowedIDs = new Set(tasks[taskName]);
  return objects.filter(o => allowedIDs.has(o.full_id));
};

export {
  tasks,
  filterObjects
};
