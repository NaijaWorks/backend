const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/tokenize');
const r = require('../helpers/responses');
const User = require('../models/user');
const Project = require('../models/project');
const Skill = require('../models/skill');

// grabbing the required properties from the graphql package
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

// defining the object types
const UserType = new GraphQLObjectType({
   name: 'User',
   fields: () => ({
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      photoURL: { type: GraphQLString },
      email: { type: GraphQLString },
      showEmail: { type: GraphQLBoolean },
      phone: { type: GraphQLString },
      showPhone: { type: GraphQLBoolean },
      password: { type: GraphQLString },
      location: { type: GraphQLString },
      role: { type: GraphQLString },
      shortBio: { type: GraphQLString },
      longBio: { type: GraphQLString },
      token: { type: GraphQLString },
      skills: {
         type: new GraphQLList(SkillType),
         resolve(parent, args) {
            return Skill.find({ userId: parent.id })
         }
      },
      projects: {
         type: new GraphQLList(ProjectType),
         resolve(parent, args) {
            return Project.find({ userId: parent.id });
         }
      }
   })
})

const SkillType = new GraphQLObjectType({
   name: 'Skill',
   fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      logo: { type: GraphQLString },
      user: {
         type: UserType,
         async resolve(parent, args) {
            const user = await User.findById(parent.userId);
            user.password = r.hidden;
            return user
         }
      }
   })
})

const ProjectType = new GraphQLObjectType({
   name: 'Project',
   fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      imageURL: { type: GraphQLString },
      description: { type: GraphQLString },
      projectURL: { type: GraphQLString },
      user: {
         type: UserType,
         async resolve(parent, args) {
            const user = await User.findById(parent.userId);
            user.password = r.hidden;
            return user
         }
      }
   })
})

// step 3: define the root query which shows how we can initially jump into the graph
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
      user: {
         type: UserType,
         args: {
            id: { type: GraphQLID }
         },
         async resolve(parent, args) {
            const user = await User.findById(args.id);
            user.password = r.hidden;
            return user
         }
      },
      project: {
         type: ProjectType,
         args: {
            id: { type: GraphQLID }
         },
         resolve(parent, args) {
            return Project.findById(args.id);
         }
      },
      users: {
         type: new GraphQLList(UserType),
         async resolve(parent, args) {
            const users = await User.find({})
            users.forEach(user => user.password = r.hidden)
            return users;
         }
      },
      projects: {
         type: new GraphQLList(ProjectType),
         resolve(parent, args) {
            return Project.find({});
         }
      }
   }
})

const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
      addProject: {
         type: ProjectType,
         args: {
            title: { type: new GraphQLNonNull(GraphQLString) },
            imageURL: { type: GraphQLString },
            description: { type: new GraphQLNonNull(GraphQLString) },
            projectURL: { type: GraphQLString },
         },
         resolve(parent, args, context) {
            try {
               if (context.user) {
                  let project = new Project({
                     title: args.title,
                     imageUrl: args.imageURL,
                     description: args.description,
                     projectURL: args.projectURL,
                     userId: context.user.id
                  });
                  return project.save();
               } else {
                  throw new Error(r.supplyToken);
               }
            } catch (error) {
               throw new Error(error.message);
            }
         }
      },
      updateProject: {
         type: ProjectType,
         args: {
            projectId: { type: GraphQLID },
            title: { type: (GraphQLString) },
            imageURL: { type: GraphQLString },
            description: { type: (GraphQLString) },
            projectURL: { type: GraphQLString },
         },
         async resolve(parent, args, context) {
            try {
               const projectToUpdate = {}
               if (context.user) {
                  args.title ? projectToUpdate.title = args.title : null
                  args.imageURL ? projectToUpdate.imageURL = args.imageURL : null
                  args.description ? projectToUpdate.description = args.description : null
                  args.projectURL ? projectToUpdate.projectURL = args.projectURL : null
                  const updatedProject = await Project.findOneAndUpdate({ _id: args.projectId }, projectToUpdate, { new: true });
                  return updatedProject;
               } else {
                  throw new Error(r.supplyToken);
               }
            } catch (error) {
               throw new Error(error.message);
            }
         }
      },
      deleteProject: {
         type: ProjectType,
         args: {
            projectId: { type: GraphQLID }
         },
         async resolve(parent, args, context) {
            try {
               if (context.user) {
                  const deletedProject = await Project.findOneAndDelete({ _id: args.projectId });
                  return deletedProject;
               } else {
                  throw new Error(r.supplyToken);
               }
            } catch (error) {
               throw new Error(error.message);
            }
         }
      },
      addSkill: {
         type: SkillType,
         args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            logo: { type: GraphQLString }
         },
         resolve(parent, args, context) {
            try {
               if (context.user) {
                  let skill = new Skill({
                     name: args.name,
                     logo: args.logo,
                     userId: context.user.id
                  });
                  return skill.save();
               } else {
                  throw new Error(r.supplyToken);
               }
            } catch (error) {
               throw new Error(error.message);
            }
         }
      },
      deleteSkill: {
         type: SkillType,
         args: {
            skillId: { type: GraphQLID }
         },
         async resolve(parent, args, context) {
            try {
               if (context.user) {
                  const deletedSkill = await Skill.findOneAndDelete({ _id: args.skillId });
                  return deletedSkill;
               } else {
                  throw new Error(r.supplyToken);
               }
            } catch (error) {
               throw new Error(error.message);
            }
         }
      },
      updateUser: {
         type: UserType,
         args: {
            firstName: { type: (GraphQLString) },
            lastName: { type: (GraphQLString) },
            photoURL: { type: GraphQLString },
            showEmail: { type: (GraphQLBoolean) },
            phone: { type: (GraphQLString) },
            showPhone: { type: (GraphQLBoolean) },
            location: { type: (GraphQLString) },
            role: { type: (GraphQLString) },
            shortBio: { type: (GraphQLString) },
            longBio: { type: (GraphQLString) }
         },
         async resolve(parent, args, context) {
            try {
               const userToUpdate = {}
               if (context.user) {
                  args.firstName ? userToUpdate.firstName = args.firstName : null;
                  args.lastName ? userToUpdate.lastName = args.lastName : null;
                  args.photoURL ? userToUpdate.photoURL = args.photoURL : null;
                  args.showEmail ? userToUpdate.showEmail = args.showEmail : null;
                  args.phone ? userToUpdate.phone = args.phone : null;
                  args.showPhone ? userToUpdate.showPhone = args.showPhone : null
                  args.location ? userToUpdate.location = args.location : null;
                  args.role ? userToUpdate.role = args.role : null;
                  args.shortBio ? userToUpdate.shortBio = args.shortBio : null;
                  args.longBio ? userToUpdate.longBio = args.longBio : null;
                  const updatedUser = await User.findOneAndUpdate({ _id: context.user.id }, userToUpdate, { new: true });
                  return updatedUser;
               } else {
                  throw new Error(r.supplyToken)
               }
            } catch (error) {
               throw new Error(error.message);
            }
         }
      },
      register: {
         type: UserType,
         args: {
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
         },
         async resolve(parent, args) {
            try {
               const newUser = new User({
                  email: args.email,
                  password: bcrypt.hashSync(args.password, 12)
               });
               const user = await User.findOne({ email: args.email });
               if (user) {
                  throw new Error(r.userExists);
               } else {
                  const savedUser = await newUser.save();
                  const token = await generateToken(savedUser);
                  savedUser.token = token;
                  return savedUser;
               }
            } catch (error) {
               throw new Error(error.message);
            }
         }
      },
      login: {
         type: UserType,
         args: {
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
         },
         async resolve(parent, args) {
            try {
               const user = await User.findOne({ email: args.email });
               if (user && bcrypt.compareSync(args.password, user.password)) {
                  const token = await generateToken(user);
                  user.token = token;
                  return user;
               } else {
                  throw new Error(r.invalid);
               }
            } catch (error) {
               throw new Error(error.message)
            }
         }
      }
   }
});

module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutation
})