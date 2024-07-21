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

        $user = new User();
        $user->setUsername('test');
        $user->setEmail('test@example.com');
        $user->setFullName('Test User');
        $user->setPassword('secret');
        $user->setRoles([]);
        $manager->persist($user);

        $device = new Device();
        $device->setUser($user);
        $device->setName('my-device');
        $device->setDescription('My Device');
        $manager->persist($device);

        $location = new Location();
        $location->setDevice($device);
        $location->setTimestamp(new DateTime('2024-07-16 00:00:00'));
        $location->setLocation(new Point(174, -40));
        $location->setAccuracy(100);
        $location->setSpeed(100);
        /* $location->setAccuracy(99);
        $location->setSpeed(99);
        $location->setTime(new DateTime('2022-07-31 00:00:00'));
        $location->setLocation(new Point(174, -40)); */
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
