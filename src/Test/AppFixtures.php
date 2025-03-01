<?php

declare(strict_types=1);

namespace App\Test;

use App\Entity\Device;
use App\Entity\Location;
use App\Entity\User;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $this->initSequences($manager);

        $user1 = new User();
        $user1->setUsername('test1');
        $user1->setEmail('test1@example.com');
        $user1->setFullName('Test User1');
        $user1->setPassword('secret');
        $user1->setRoles([]);

        $user2 = new User();
        $user2->setUsername('test2');
        $user2->setEmail('test2@example.com');
        $user2->setFullName('Test User2');
        $user2->setPassword('secret');
        $user2->setRoles([]);

        $user3 = new User();
        $user3->setUsername('test3');
        $user3->setEmail('test3@example.com');
        $user3->setFullName('Test User3');
        $user3->setPassword('secret');
        $user3->setRoles([]);

        $user1->addFriend($user2);
        $manager->persist($user1);
        $manager->persist($user2);
        $manager->persist($user3);

        $device = new Device();
        $device->setUser($user1);
        $device->setName('my-device');
        $device->setDescription('My Device');
        $manager->persist($device);

        $location = new Location();
        $location->setDevice($device);
        $location->setTimestamp(new DateTime('2024-07-16 00:00:00'));
        $location->setInsertTimestamp(new DateTime('2024-07-16 00:00:00'));
        $location->setLocation(new Point(174, -40));
        $location->setAccuracy(100);
        $location->setSpeed(100);
        $manager->persist($location);

        $manager->flush();
    }

    private function initSequences(ObjectManager $manager): void
    {
        $manager->getConnection()->executeStatement('ALTER SEQUENCE device_id_seq RESTART');
        $manager->getConnection()->executeStatement('ALTER SEQUENCE user_id_seq RESTART');
        $manager->getConnection()->executeStatement('ALTER SEQUENCE location_id_seq RESTART');
    }
}
