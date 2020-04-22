import FSDoc from './FSDoc';

class CommunityGroupModel extends FSDoc {
  constructor(firebaseCGDoc) {
    super(firebaseCGDoc, 'communitygroups');
    // TODO: populate updated with doc info
    this.updated = {
      day: '',
      description: '',
      dorm: '',
      gender: '',
      leaders: [],
      movements: '',
      name: '',
      time: '',
      year: ''
    };
  }

  get day() {
    if (this.doc) {
      return this.doc.data().day;
    }

    if (this.updated.name) {
      return this.updated.day;
    }

    return '';
  }

  set day(day) {
    this.updated.day = day;
  }

  get description() {
    if (this.doc) {
      return this.doc.data().description;
    }

    if (this.updated.description) {
      return this.updated.description;
    }

    return '';
  }

  set description(description) {
    this.updated.description = description;
  }

  get dorm() {
    if (this.doc) {
      return this.doc.data().dorm;
    }

    if (this.updated.dorm) {
      return this.updated.dorm;
    }

    return '';
  }

  set dorm(dorm) {
    this.updated.dorm = dorm;
  }

  get gender() {
    if (this.doc) {
      return this.doc.data().gender;
    }

    if (this.updated.gender) {
      return this.updated.gender;
    }

    return '';
  }

  set gender(gender) {
    this.updated.gender = gender;
  }

  get leaders() {
    if (this.doc) {
      return this.doc.data().leaders;
    }

    if (this.updated.leaders) {
      return this.updated.leaders;
    }

    return '';
  }

  set leaders(leaders) {
    this.updated.leaders = leaders;
  }

  get movement() {
    if (this.doc) {
      return this.doc.data().movement;
    }

    if (this.updated.movement) {
      return this.updated.movement;
    }

    return '';
  }

  set movement(movement) {
    this.updated.movement = movement;
  }

  get name() {
    if (this.doc) {
      return this.doc.data().name;
    }

    if (this.updated.name) {
      return this.updated.name;
    }

    return '';
  }

  set name(name) {
    this.updated.name = name;
    console.log('current statte', this);
  }

  get time() {
    if (this.doc) {
      return this.doc.data().time;
    }

    if (this.updated.time) {
      return this.updated.time;
    }

    return '';
  }

  set time(time) {
    this.updated.time = time;
  }

  get year() {
    if (this.doc) {
      return this.doc.data().year;
    }

    if (this.updated.year) {
      return this.updated.year;
    }

    return '';
  }

  set year(year) {
    this.updated.year = year;
  }

  submit() {
    super.submit();
  }

  fetch() {
    // TODO: update fetch to refresh the doc and clear updated
  }

  delete() {
    // TODO: delete the doc
  }

  validate() {
    // TODO: check that start and end aren't null
  }
}

export default CommunityGroupModel;