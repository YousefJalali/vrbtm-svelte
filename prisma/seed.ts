import { PrismaClient } from '@prisma/client'
import { generateId } from 'lucia'
import { faker } from '@faker-js/faker'
import { Argon2id } from 'oslo/password'
import { readingTime } from '../src/lib/utils/readingTime'
import { IMAGES } from '../src/constants/images'

const prisma = new PrismaClient()

const STATUS = ['pending', 'ongoing', 'completed']

async function main() {
  console.log(`Start seeding ...`)
  const normalPwd: {}[] = []

  for (let i = 0; i < 5; i++) {
    let pwd = generateId(15)
    let email = faker.internet.email()
    normalPwd.push({ email, pwd })

    const hashedPassword = await new Argon2id().hash(pwd)
    const user = await prisma.user.create({
      data: {
        id: generateId(15),
        email,
        name: faker.person.fullName(),
        hashedPassword,
        emailVerified: false,
      },
    })

    //create posts
    await prisma.post.createMany({
      data: new Array(5).fill(0).map((e, i) => {
        const content = faker.lorem.paragraphs({ min: 30, max: 100 }, '<br/>\n')
        const image = IMAGES[Math.floor(Math.random() * IMAGES.length)]

        return {
          id: generateId(15),
          title: faker.lorem.lines(1),
          content,
          readingTime: readingTime(content),
          published: Math.random() < 0.5,
          authorId: user.id,
          imgPublicId: image.public_id,
          imgWidth: image.width,
          imgHeight: image.height,
          imgUrl: image.url,
          thumbnailUrl: image.thumbnail_url,
        }
      }),
    })

    //create todos
    await prisma.todo.createMany({
      data: new Array(5).fill(0).map((e, i) => {
        return {
          id: generateId(15),
          content: faker.lorem.lines(1),
          status: STATUS[~~(Math.random() * STATUS.length)],
          userId: user.id,
          indexNumber: (i + 1) * 1024,
        }
      }),
    })

    console.log(`Created user with id: ${user.id}`)
  }

  console.log(normalPwd)
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
